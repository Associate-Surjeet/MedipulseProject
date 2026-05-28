using System.ComponentModel.DataAnnotations;

namespace LogisticsService.Models;

// Records stock consumed at a facility/ward.
// FacilityId, WardId, and ItemId are cross-service references — no EF FK enforcement.
// ItemName is denormalised at creation time.
public class ConsumptionRecord
{
    [Key]
    public int ConsumptionId { get; set; }

    [Required]
    public int FacilityId { get; set; }

    public int? WardId { get; set; }

    [Required]
    public int ItemId { get; set; }

    [Required, MaxLength(150)]
    public string ItemName { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue)]
    public int QuantityConsumed { get; set; }

    [Required]
    public DateTime ConsumedDate { get; set; } = DateTime.UtcNow;

    [Required, MaxLength(100)]
    public string ConsumedBy { get; set; } = string.Empty;
}
