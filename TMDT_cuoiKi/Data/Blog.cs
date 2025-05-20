using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class Blog
{
    public int Idblog { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public string? HinhAnh { get; set; }

    public DateTime? NgayDang { get; set; }

    public virtual ICollection<DanhMuc> IddanhMucs { get; set; } = new List<DanhMuc>();
}
