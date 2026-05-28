using System.ComponentModel.DataAnnotations;

namespace InventoryService.Models;

public class Item
{
    public int ItemId { get; set; }

    [Required, MaxLength(50)]
    public string ItemCode { get; set; } = string.Empty;   // e.g. "MED-001"

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;   // Pharma / Device / Consumable

    [Required, MaxLength(20)]
    public string Unit { get; set; } = string.Empty;       // UnitOfMeasure: Box / Vial / Piece

    [MaxLength(50)]
    public string StorageRequirement { get; set; } = "Ambient";  // Ambient / Refrigerated / Freezer

    public int SafetyStock { get; set; }                   // alert threshold for this item

    // One Item can have many InventoryPositions (different lots/batches)
    public ICollection<InventoryPosition> Positions { get; set; } = new List<InventoryPosition>();
}
