using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
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

        return View();
    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
