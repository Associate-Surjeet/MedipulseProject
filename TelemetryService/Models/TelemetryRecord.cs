using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TelemetryService.Models;

// TelemetryRecord is a single sensor reading ingested from a SensorDevice.
// Excursion detection runs automatically on ingest (see TelemetryServiceImpl).
public class TelemetryRecord
{
    // Primary key — maps to column TelemetryID in the database.
    [Key]
    public int TelemetryId { get; set; }

    // FK to SensorDevice — the sensor that produced this reading.
    [Required]
    public int SensorId { get; set; }

    // UTC timestamp of when the reading was captured.
    [Required]
    public DateTime Timestamp { get; set; }

    // Temperature in °C. Null when DeviceType is not Temp.
    [Column(TypeName = "decimal(5,2)")]
    public decimal? Temperature { get; set; }

    // Relative humidity as a percentage. Null when DeviceType is not Humidity.
    [Column(TypeName = "decimal(5,2)")]
    public decimal? Humidity { get; set; }

    // GPS coordinates string e.g. "13.0827,80.2707". Null when DeviceType is not GPS.
    [MaxLength(200)]
    public string? Location { get; set; }

    // True when Temperature or Humidity is outside the safe pharmaceutical storage range.
    // Auto-set on ingest by TelemetryServiceImpl.
    public bool IsExcursion { get; set; } = false;

    // Human-readable explanation of which threshold was breached. Null when IsExcursion is false.
    [MaxLength(500)]
    public string? ExcursionNote { get; set; }

    // Navigation — back-reference to the owning SensorDevice.
    public SensorDevice? SensorDevice { get; set; }
}
