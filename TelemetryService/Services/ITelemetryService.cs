using TelemetryService.DTOs;

namespace TelemetryService.Services;

// TelemetryService owns: SensorDevice, TelemetryRecord.
// All EF navigation is local — no cross-service HTTP calls needed.
public interface ITelemetryService
{
    // ── SensorDevices ─────────────────────────────────────────────────────
    Task<IEnumerable<SensorDeviceDto>> GetAllSensorsAsync();
    Task<SensorDeviceDto?> GetSensorByIdAsync(int id);
    Task<SensorDeviceDto> CreateSensorAsync(CreateSensorDeviceRequest request);
    Task<SensorDeviceDto?> UpdateSensorAsync(int id, UpdateSensorDeviceRequest request);

    // Delete blocked if sensor has associated TelemetryRecords (throws InvalidOperationException).
    Task<bool> DeleteSensorAsync(int id);

    // Returns all TelemetryRecords belonging to the given sensor.
    Task<IEnumerable<TelemetryRecordDto>> GetTelemetryBySensorAsync(int sensorId);

    // ── TelemetryRecords ──────────────────────────────────────────────────
    Task<IEnumerable<TelemetryRecordDto>> GetAllTelemetryAsync();
    Task<TelemetryRecordDto?> GetTelemetryByIdAsync(int id);

    // Returns only records where IsExcursion = true.
    Task<IEnumerable<TelemetryRecordDto>> GetExcursionsAsync();

    // Excursion detection runs automatically on ingest.
    Task<TelemetryRecordDto> CreateTelemetryAsync(CreateTelemetryRecordRequest request);
    Task<TelemetryRecordDto?> UpdateTelemetryAsync(int id, UpdateTelemetryRecordRequest request);
    Task<bool> DeleteTelemetryAsync(int id);
}
