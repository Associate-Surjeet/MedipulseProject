using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcurementService.Models;

// Maps to Receipt table (PDF spec section 4.3 / section 6).
// A GRN (Goods Receipt Note) is created when physical goods arrive against a PO.
// SupplierLot captured here feeds downstream lot/expiry tracking in InventoryService.
// QualityStatus: Accepted | Rejected | OnHold — drives quality-hold workflow.
public class Receipt
{
    [Key]
    public int ReceiptId { get; set; }

    [Required]
    public int PoId { get; set; }

    [MaxLength(100)]
    public string? SupplierLot { get; set; }

    [Required]
    public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;

    [Required, MaxLength(100)]
    public string ReceivedBy { get; set; } = string.Empty;

    // Accepted | Rejected | OnHold
    [Required, MaxLength(50)]
    public string QualityStatus { get; set; } = "Accepted";

    [Required]
    public int QuantityReceived { get; set; }

    [MaxLength(500)]
    public string? Remarks { get; set; }

    [ForeignKey(nameof(PoId))]
    public PurchaseOrder? PurchaseOrder { get; set; }
}
