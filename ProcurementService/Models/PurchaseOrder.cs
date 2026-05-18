using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProcurementService.Models;

// Maps to PurchaseOrder table (PDF spec section 4.3 / section 6).
// ProcurementService owns Supplier, PurchaseOrder, and Receipt — all in the same DB.
// Full EF navigation is used: SupplierId is a real enforced FK to the local Supplier table.
//
// Status lifecycle: Draft → Submitted → Approved → Shipped
//                   → PartiallyReceived → FullyReceived | Cancelled
public class PurchaseOrder
{
    [Key]
    public int PoId { get; set; }

    // FK to Supplier — enforced by EF, both tables live in ProcurementService's DB
    [Required]
    public int SupplierId { get; set; }

    [Required]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public DateTime? ExpectedDeliveryDate { get; set; }

    [Required, MaxLength(50)]
    public string Status { get; set; } = "Draft";

    [MaxLength(500)]
    public string? Notes { get; set; }

    // Navigation to parent Supplier
    [ForeignKey(nameof(SupplierId))]
    public Supplier? Supplier { get; set; }

    // Navigation to child Receipts
    public ICollection<Receipt> Receipts { get; set; } = new List<Receipt>();
}
