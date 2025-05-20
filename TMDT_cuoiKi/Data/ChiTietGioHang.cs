using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class ChiTietGioHang
{
    public int IdchiTietGioHang { get; set; }

    public int? IdgioHang { get; set; }

    public string? IdsanPham { get; set; }

    public int? SoLuongDat { get; set; }

    public virtual GioHang? IdgioHangNavigation { get; set; }

    public virtual SanPham? IdsanPhamNavigation { get; set; }
}
