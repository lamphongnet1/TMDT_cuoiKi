using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class HinhAnhSanPham
{
    public int IdhinhAnh { get; set; }

    public string? HinhAnh { get; set; }

    public string? IdsanPham { get; set; }

    public virtual SanPham? IdsanPhamNavigation { get; set; }
}
