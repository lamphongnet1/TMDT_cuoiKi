using System;
using System.Collections.Generic;

namespace TMDT_cuoiKi.Data;

public partial class ThanhToan
{
    public int IdthanhToan { get; set; }

    public string? MaThanhToan { get; set; }

    public string? TenThanhToan { get; set; }

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();
}
