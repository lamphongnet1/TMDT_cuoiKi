using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class SanPham
{
    public string IdsanPham { get; set; } = null!;

    public string? TenSanPham { get; set; }

    public int? IddanhMuc { get; set; }

    public decimal? GiaBan { get; set; }

    public int? SoLuongTon { get; set; }

    public string? MoTa { get; set; }

    public string? DonViTinh { get; set; }

    public string? XuatXu { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    public virtual ICollection<ChiTietGioHang> ChiTietGioHangs { get; set; } = new List<ChiTietGioHang>();

    public virtual ICollection<HinhAnhSanPham> HinhAnhSanPhams { get; set; } = new List<HinhAnhSanPham>();

    public virtual DanhMuc? IddanhMucNavigation { get; set; }
}
