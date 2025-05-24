using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TMDT_cuoiKi.Data;
using TMDT_cuoiKi.Models;

namespace TMDT_cuoiKi.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ShopHueDaQuaContext _context;

    public HomeController(ILogger<HomeController> logger, ShopHueDaQuaContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }
    public IActionResult ChiTietSanPham(string id)
    {
        // Truy vấn sản phẩm theo ID
        var sanPham = _context.SanPhams.FirstOrDefault(sp => sp.IdsanPham == id);

        if (sanPham == null)
        {
            return NotFound(); // Xử lý nếu không tìm thấy sản phẩm
        }

        ViewBag.Id = id;
        ViewData["Title"] = sanPham.TenSanPham; // Gán tên sản phẩm cho title
        ViewBag.Reviews = GetAllReviewsById(id);
        ViewBag.RatingSummary = GetRatingSummaryById(id); // Gán thống kê sao
        return View();
    }
    private List<object> GetAllReviewsById(string id)
    {
        var danhGiaList = _context.DanhGia
            .Include(dg => dg.IdchiTietDonHangNavigation)
                .ThenInclude(ct => ct.IddonHangNavigation)
                    .ThenInclude(dh => dh.IdkhachHangNavigation)
            .Where(dg => dg.IdchiTietDonHangNavigation.IdsanPham == id)
            .OrderByDescending(dg => dg.ThoiGian)
            .Select(dg => new {
                dg.IddanhGia,
                dg.SoSao,
                dg.NoiDung,
                dg.ThoiGian,
                TenKhachHang = dg.IdchiTietDonHangNavigation.IddonHangNavigation.IdkhachHangNavigation.HoTen
            })
            .ToList<object>(); // Cast thành object nếu cần lưu ViewBag

        return danhGiaList;
    }
    private object GetRatingSummaryById(string id)
    {
        var danhGiaList = _context.DanhGia
            .Include(dg => dg.IdchiTietDonHangNavigation)
            .Where(dg => dg.IdchiTietDonHangNavigation.IdsanPham == id)
            .ToList();

        if (danhGiaList.Count == 0)
        {
            return new
            {
                averageRating = 0,
                total = 0,
                percentages = new Dictionary<int, double>
            {
                { 5, 0 },
                { 4, 0 },
                { 3, 0 },
                { 2, 0 },
                { 1, 0 }
            }
            };
        }

        int total = danhGiaList.Count;
        double averageRating = danhGiaList.Average(dg => (double?)dg.SoSao) ?? 0;

        var ratingGroups = danhGiaList
            .GroupBy(dg => dg.SoSao)
            .Select(g => new { SoSao = g.Key, Count = g.Count() })
            .ToDictionary(x => x.SoSao, x => x.Count);

        var percentages = new Dictionary<int, double>();
        for (int i = 1; i <= 5; i++)
        {
            ratingGroups.TryGetValue(i, out int count);
            percentages[i] = Math.Round((double)count / total * 100, 2);
        }

        return new
        {
            averageRating = Math.Round(averageRating, 1),
            total,
            percentages
        };
    }

    [HttpPost]
    public IActionResult SubmitDanhGia(string idSanPham, int soSao, string noiDung)
    {
        int khachHangId = 1; // Tạm hard-code, sau này lấy từ session đăng nhập

        // Kiểm tra dữ liệu đầu vào
        if (string.IsNullOrWhiteSpace(idSanPham) || soSao < 1 || soSao > 5 || string.IsNullOrWhiteSpace(noiDung))
        {
            return Json(new { success = false, message = "Thông tin đánh giá không hợp lệ." });
        }

        // Tìm chi tiết đơn hàng khớp với sản phẩm và khách hàng
        var chiTietDonHang = _context.ChiTietDonHangs
            .Include(ct => ct.IddonHangNavigation)
            .FirstOrDefault(ct =>
                ct.IdsanPham == idSanPham &&
                ct.IddonHangNavigation.IdkhachHang == khachHangId);

        if (chiTietDonHang == null)
        {
            return Json(new { success = false, message = "Không tìm thấy thông tin đơn hàng chứa sản phẩm này của bạn." });
        }

        // Tạo đánh giá mới
        var danhGia = new DanhGium
        {
            IdchiTietDonHang = chiTietDonHang.IdchiTietDonHang,
            SoSao = soSao,
            NoiDung = noiDung,
            ThoiGian = DateTime.Now
        };

        _context.DanhGia.Add(danhGia);
        _context.SaveChanges();

        return Json(new { success = true, message = "Đánh giá đã được gửi thành công!" });
    }



    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
