using InventoryService.DTOs;

namespace InventoryService.Services;

public interface IExceptionService
{
    // ── ExceptionEvents ───────────────────────────────────────────────────
    Task<IEnumerable<ExceptionEventDto>> GetAllAsync(string? type, string? status, string? severity);
    Task<ExceptionEventDto?>             GetByIdAsync(int id);
    Task<ExceptionEventDto>              CreateAsync(CreateExceptionRequest request);
    Task<ExceptionEventDto?>             UpdateStatusAsync(int id, UpdateExceptionStatusRequest request);
    Task<bool>                           DeleteAsync(int id);

    // Auto-scan inventory and create exceptions for stockouts / expiring lots
    Task<DetectExceptionsResult>         DetectAsync(int? facilityId, int expiryThresholdDays);

    // ── RecallActions ─────────────────────────────────────────────────────
    Task<IEnumerable<RecallActionDto>>   GetActionsAsync(int exceptionId);
    Task<RecallActionDto?>               GetActionByIdAsync(int id);
    Task<RecallActionDto>                CreateActionAsync(CreateRecallActionRequest request);
    Task<RecallActionDto?>               UpdateActionAsync(int id, UpdateRecallActionRequest request);
    Task<bool>                           DeleteActionAsync(int id);
}
