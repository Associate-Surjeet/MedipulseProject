using System.ComponentModel.DataAnnotations;

namespace InventoryService.DTOs;

// What the API accepts when ADDING a new stock batch (receiving a shipment)
public class CreatePositionRequest
{
    [Required]
    public int ItemId { get; set; }

    [Required, MaxLength(50)]
    public string LotId { get; set; } = string.Empty;

    [Required]
    public DateTime ExpiryDate { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
    public int Quantity { get; set; }

    [Required]
    public int FacilityId { get; set; }

    [Required]
    public int StorageZoneId { get; set; }

    [Range(0, int.MaxValue)]
    public int SafetyStock { get; set; }           // reorder threshold for this item at this facility

    public DateTime? ReceivedDate { get; set; }   // defaults to now if not provided
}

// What the API accepts when UPDATING a position (e.g. adjusting quantity after a count)
public class UpdatePositionRequest
{
    [Range(0, int.MaxValue)]
    public int? Quantity { get; set; }

    public int? FacilityId { get; set; }

    public int? StorageZoneId { get; set; }

    public int? SafetyStock { get; set; }

    public DateTime? ExpiryDate { get; set; }
}

// What the API RETURNS for a single inventory position
public class PositionResponse
{
    public int PositionId { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;   // joined from Items table
    public string ItemCode { get; set; } = string.Empty;   // joined from Items table
    public string LotId { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public int Quantity { get; set; }
    public int FacilityId { get; set; }
    public int StorageZoneId { get; set; }
    public int SafetyStock { get; set; }
    public DateTime ReceivedDate { get; set; }
    public bool IsExpired => ExpiryDate < DateTime.UtcNow;
    public bool IsExpiringSoon => ExpiryDate < DateTime.UtcNow.AddDays(90) && !IsExpired;
    public bool IsBelowSafetyStock => Quantity < SafetyStock;   // stockout alert flag
}
