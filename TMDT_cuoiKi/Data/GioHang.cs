using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class GioHang
{
    public int IdgioHang { get; set; }

    public int? IdkhachHang { get; set; }

    public virtual ICollection<ChiTietGioHang> ChiTietGioHangs { get; set; } = new List<ChiTietGioHang>();

    public virtual KhachHang? IdkhachHangNavigation { get; set; }
}
