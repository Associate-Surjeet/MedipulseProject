using System.ComponentModel.DataAnnotations;

namespace ProcurementService.Models;

// Supplier is owned by ProcurementService (covers: Suppliers, PurchaseOrders, Receipts).
// Full EF navigation: one Supplier → many PurchaseOrders.
public class Supplier
{
    [Key]
    public int SupplierId { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    // Manufacturer | Distributor | 3PL
    [MaxLength(50)]
    public string? SupplierType { get; set; }

    // Active | Inactive | OnHold
    [Required, MaxLength(50)]
    public string Status { get; set; } = "Active";

    // Navigation — one Supplier has many PurchaseOrders
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
}
