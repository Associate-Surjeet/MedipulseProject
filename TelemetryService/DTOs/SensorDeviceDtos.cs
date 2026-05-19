using System.ComponentModel.DataAnnotations;

namespace TelemetryService.DTOs;

// ── SensorDevice DTOs ─────────────────────────────────────────────────────

public class SensorDeviceDto
{
    public int    SensorId        { get; set; }
    public string DeviceType      { get; set; } = string.Empty;
    public string AssignedTo      { get; set; } = string.Empty;
    public int?   AssignedEntityId { get; set; }
    public string Status          { get; set; } = string.Empty;
}

public class CreateSensorDeviceRequest
{
    [Required(ErrorMessage = "DeviceType is required.")]
    [RegularExpression("^(Temp|Humidity|GPS)$",
        ErrorMessage = "DeviceType must be Temp, Humidity, or GPS.")]
    public string DeviceType { get; set; } = string.Empty;

    [Required(ErrorMessage = "AssignedTo is required.")]
    [RegularExpression("^(Shipment|Zone)$",
        ErrorMessage = "AssignedTo must be Shipment or Zone.")]
    public string AssignedTo { get; set; } = string.Empty;

    public int? AssignedEntityId { get; set; }

    [RegularExpression("^(Active|Inactive|Faulty)$",
        ErrorMessage = "Status must be Active, Inactive, or Faulty.")]
    public string Status { get; set; } = "Active";
}

public class UpdateSensorDeviceRequest
{
    [Required(ErrorMessage = "DeviceType is required.")]
    [RegularExpression("^(Temp|Humidity|GPS)$",
        ErrorMessage = "DeviceType must be Temp, Humidity, or GPS.")]
    public string DeviceType { get; set; } = string.Empty;

    [Required(ErrorMessage = "AssignedTo is required.")]
    [RegularExpression("^(Shipment|Zone)$",
        ErrorMessage = "AssignedTo must be Shipment or Zone.")]
    public string AssignedTo { get; set; } = string.Empty;

    public int? AssignedEntityId { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [RegularExpression("^(Active|Inactive|Faulty)$",
        ErrorMessage = "Status must be Active, Inactive, or Faulty.")]
    public string Status { get; set; } = string.Empty;
}
