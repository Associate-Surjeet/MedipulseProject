export interface NotificationDto {
  notificationId: number;
  userId: string;
  category: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotificationRequest {
  userId: string;
  category: string;
  title: string;
  message: string;
}

export interface UnreadCountDto {
  count: number;
}
