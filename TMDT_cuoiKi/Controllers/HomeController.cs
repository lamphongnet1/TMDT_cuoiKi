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


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
