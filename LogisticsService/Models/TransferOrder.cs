using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticsService.Models;

// A transfer order moves stock from one facility to another.
// FacilityIds are cross-service references — no EF FK enforcement.
// Names are denormalised at creation time so no cross-service calls are needed at read time.
//
// Status lifecycle:
//   Draft → Submitted → Approved → InTransit → Completed | Cancelled
public class TransferOrder
{
    [Key]
    public int TransferOrderId { get; set; }

    // ── Source ────────────────────────────────────────────────────────────
    [Required]
    public int FromFacilityId { get; set; }

    [Required, MaxLength(100)]
    public string FromFacilityName { get; set; } = string.Empty;

    // ── Destination ───────────────────────────────────────────────────────
    [Required]
    public int ToFacilityId { get; set; }

    [Required, MaxLength(100)]
    public string ToFacilityName { get; set; } = string.Empty;

    // ── Metadata ──────────────────────────────────────────────────────────
    [Required, MaxLength(100)]
    public string RequestedBy { get; set; } = string.Empty;

    [Required]
    public DateTime RequestedDate { get; set; } = DateTime.UtcNow;

    [Required, MaxLength(50)]
    public string Status { get; set; } = "Draft";

    // ── Children ──────────────────────────────────────────────────────────
    public ICollection<TransferOrderItem> Items { get; set; } = new List<TransferOrderItem>();
}
