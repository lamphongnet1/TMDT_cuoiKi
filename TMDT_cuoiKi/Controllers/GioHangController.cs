using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TMDT_cuoiKi.Data;

namespace TMDT_cuoiKi.Controllers
{
    public class GioHangController : Controller
    {
        private readonly ShopHueDaQuaContext _context;

        public GioHangController(ShopHueDaQuaContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var chiTietGioHangList = _context.ChiTietGioHangs
           .Where(c => c.IdgioHang == 1)
           .Include(c => c.IdsanPhamNavigation)
             .ThenInclude(p => p.HinhAnhSanPhams)
           .ToList();

            return View(chiTietGioHangList);
        }
    }
}
