using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TMDT_cuoiKi.Data;
using TMDT_cuoiKi.Models;
using TMDT_cuoiKi.Models;

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
            var cartId = 1;

            var chiTietGioHangList = _context.ChiTietGioHangs
                .Where(c => c.IdgioHang == cartId)
                .Include(c => c.IdsanPhamNavigation)
                    .ThenInclude(p => p.HinhAnhSanPhams)
                .ToList();

            var goiYSanPhams = _context.SanPhams
                .Include(p => p.HinhAnhSanPhams)
                .OrderBy(p => Guid.NewGuid())
                .Take(4)
                .ToList();

            var viewModel = new GioHangViewModel
            {
                ChiTietGioHangList = chiTietGioHangList,
                GoiYSanPhams = goiYSanPhams
            };

            return View(viewModel);
        }
    }
}
