using NotificationService.DTOs;

namespace NotificationService.Services;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetNotificationsAsync(NotificationQueryParams query);
    Task<int>                          GetUnreadCountAsync(string userId);
    Task<NotificationDto>              CreateAsync(CreateNotificationRequest request);
    Task<NotificationDto?>             MarkReadAsync(int id, string callerUserId, bool isAdmin);
    Task                               MarkAllReadAsync(string userId);
    Task<bool>                         DeleteAsync(int id, string callerUserId, bool isAdmin);
}
