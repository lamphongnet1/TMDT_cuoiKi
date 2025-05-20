using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class ChiTietDonHang
{
    public int IdchiTietDonHang { get; set; }

    public int? IddonHang { get; set; }

    public string? IdsanPham { get; set; }

    public int? SoLuong { get; set; }

    public virtual ICollection<DanhGium> DanhGia { get; set; } = new List<DanhGium>();

    public virtual DonHang? IddonHangNavigation { get; set; }

    public virtual SanPham? IdsanPhamNavigation { get; set; }
}
