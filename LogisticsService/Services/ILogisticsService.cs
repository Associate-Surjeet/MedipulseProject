using LogisticsService.DTOs;

namespace LogisticsService.Services;

public interface ILogisticsService
{
    // ── Transfer Orders ───────────────────────────────────────────────────
    Task<IEnumerable<TransferOrderDto>> GetAllTransferOrdersAsync();
    Task<IEnumerable<TransferOrderDto>> GetTransferOrdersByFacilityAsync(int facilityId);
    Task<TransferOrderDto?> GetTransferOrderByIdAsync(int id);
    Task<TransferOrderDto> CreateTransferOrderAsync(CreateTransferOrderRequest request);
    Task<TransferOrderDto?> UpdateTransferOrderAsync(int id, UpdateTransferOrderRequest request);
    Task<TransferOrderDto?> UpdateTransferStatusAsync(int id, UpdateTransferStatusRequest request);

    // Only Draft or Cancelled orders can be deleted
    Task<bool> DeleteTransferOrderAsync(int id);

    // ── Consumption Records ───────────────────────────────────────────────
    Task<IEnumerable<ConsumptionRecordDto>> GetAllConsumptionAsync();
    Task<IEnumerable<ConsumptionRecordDto>> GetConsumptionByFacilityAsync(int facilityId);
    Task<IEnumerable<ConsumptionRecordDto>> GetConsumptionByItemAsync(int itemId);
    Task<ConsumptionRecordDto?> GetConsumptionByIdAsync(int id);
    Task<ConsumptionRecordDto> CreateConsumptionAsync(CreateConsumptionRequest request);
    Task<ConsumptionRecordDto?> UpdateConsumptionAsync(int id, UpdateConsumptionRequest request);
    Task<bool> DeleteConsumptionAsync(int id);
}
