using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class DonHang
{
    public int IddonHang { get; set; }

    public int? IdkhachHang { get; set; }

    public DateOnly? NgayLap { get; set; }

    public string? TrangThai { get; set; }

    public decimal? TongTien { get; set; }

    public int? IdthanhToan { get; set; }

    public string? DiaChi { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    public virtual KhachHang? IdkhachHangNavigation { get; set; }

    public virtual ThanhToan? IdthanhToanNavigation { get; set; }
}
