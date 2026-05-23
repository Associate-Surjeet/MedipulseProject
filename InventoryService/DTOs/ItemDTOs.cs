using System.ComponentModel.DataAnnotations;

namespace InventoryService.DTOs;

// What the API accepts when CREATING a new item
public class CreateItemRequest
{
    [Required, MaxLength(50)]
    public string ItemCode { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Description { get; set; }

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Unit { get; set; } = string.Empty;

    [MaxLength(50)]
    public string StorageRequirement { get; set; } = "Ambient";  // Ambient / Refrigerated / Freezer

    [Range(0, int.MaxValue)]
    public int SafetyStock { get; set; }
}

// What the API accepts when UPDATING an existing item
public class UpdateItemRequest
{
    [MaxLength(150)]
    public string? Name { get; set; }

    [MaxLength(300)]
    public string? Description { get; set; }

    [MaxLength(50)]
    public string? Category { get; set; }

    [MaxLength(20)]
    public string? Unit { get; set; }

    [MaxLength(50)]
    public string? StorageRequirement { get; set; }

    [Range(0, int.MaxValue)]
    public int? SafetyStock { get; set; }

    public bool? IsActive { get; set; }
}

// What the API RETURNS — safe to expose, includes read-only fields
public class ItemResponse
{
    public int ItemId { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public string StorageRequirement { get; set; } = string.Empty;
    public int SafetyStock { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalStock { get; set; }   // sum of all lot quantities — calculated in the service layer
}
