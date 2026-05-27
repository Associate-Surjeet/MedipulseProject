using System.ComponentModel.DataAnnotations;

namespace InventoryService.Models;

public class Item
{
    public int ItemId { get; set; }

    [Required, MaxLength(50)]
    public string ItemCode { get; set; } = string.Empty;   // e.g. "MED-001"

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;       // e.g. "Paracetamol 500mg"

    [MaxLength(300)]
    public string? Description { get; set; }

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;   // e.g. "Medication", "Device"

    [Required, MaxLength(20)]
    public string Unit { get; set; } = string.Empty;       // e.g. "Box", "Vial", "Piece"

    [MaxLength(50)]
    public string StorageRequirement { get; set; } = "Ambient";  // Ambient / Refrigerated / Freezer

    public int SafetyStock { get; set; }                   // default alert threshold for this item

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // One Item can have many InventoryPositions (different lots/batches)
    public ICollection<InventoryPosition> Positions { get; set; } = new List<InventoryPosition>();
}
