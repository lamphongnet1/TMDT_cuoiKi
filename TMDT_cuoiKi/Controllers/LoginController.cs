using Microsoft.AspNetCore.Mvc;
using TMDT_cuoiKi.Models;
using TMDT_cuoiKi.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace TMDT_cuoiKi.Controllers
{
    public class LoginController : Controller
    {
        private readonly ShopHueDaQuaContext _context;

        public LoginController(ShopHueDaQuaContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home"); 
            }
            return View(); // Return View() nếu chưa đăng nhập
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _context.KhachHangs.FirstOrDefault(x =>
                    (x.TaiKhoan == model.Username || x.Email == model.Username) &&
                    x.MatKhau == model.Password);

                if (user != null)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.TaiKhoan ?? ""), 
                        new Claim(ClaimTypes.Email, user.Email ?? ""),
                        new Claim("IdKhachHang", user.IdkhachHang.ToString())
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = model.RememberMe,
                        ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
                    };

                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties);

                    TempData["Success"] = "Đăng nhập thành công!";
                    return RedirectToAction("Index", "Home");
                }

                ModelState.AddModelError("", "Tên đăng nhập hoặc mật khẩu không đúng");
            }

            return View("Index", model);
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (_context.KhachHangs.Any(x => x.TaiKhoan == model.Username))
                {
                    ModelState.AddModelError("Username", "Tên đăng nhập đã tồn tại");
                    return View("Index", model);
                }

                if (_context.KhachHangs.Any(x => x.Email == model.Email))
                {
                    ModelState.AddModelError("Email", "Email đã được sử dụng");
                    return View("Index", model);
                }

                var khachHang = new KhachHang
                {
                    TaiKhoan = model.Username,
                    Email = model.Email,
                    MatKhau = model.Password,
                    HoTen = model.Username
                };

                _context.KhachHangs.Add(khachHang);
                await _context.SaveChangesAsync();

                TempData["Success"] = "Đăng ký tài khoản thành công!";

                // Tự động đăng nhập sau khi đăng ký
                return await Login(new LoginViewModel
                {
                    Username = model.Username,
                    Password = model.Password
                });
            }

            return View("Index", model);
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            TempData["Success"] = "Đăng xuất thành công!";
            return RedirectToAction("Index", "Home");
        }
    }
}