using AuditService.DTOs;

namespace AuditService.Services;

public interface IAuditLogService
{
    Task<AuditLogDto> CreateAsync(CreateAuditLogRequest request);
    Task<PagedResult<AuditLogDto>> QueryAsync(AuditQueryParams query);
    Task<AuditLogDto?> GetByIdAsync(int id);
}
