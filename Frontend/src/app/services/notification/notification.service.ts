import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { NotificationDto, CreateNotificationRequest, UnreadCountDto } from './notification.models';

const BASE = '/api/notifications';
const T = 8_000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotifications(params?: { category?: string; isRead?: boolean; page?: number; pageSize?: number }): Observable<NotificationDto[]> {
    let p = new HttpParams();
    if (params?.category) p = p.set('category', params.category);
    if (params?.isRead !== undefined) p = p.set('isRead', params.isRead);
    if (params?.page) p = p.set('page', params.page);
    if (params?.pageSize) p = p.set('pageSize', params.pageSize);
    return this.http.get<NotificationDto[]>(BASE, { params: p }).pipe(timeout(T));
  }

  getUnreadCount(): Observable<UnreadCountDto> {
    return this.http.get<UnreadCountDto>(`${BASE}/unread-count`).pipe(timeout(T));
  }

  create(req: CreateNotificationRequest): Observable<NotificationDto> {
    return this.http.post<NotificationDto>(BASE, req).pipe(timeout(T));
  }

  markRead(id: number): Observable<NotificationDto> {
    return this.http.patch<NotificationDto>(`${BASE}/${id}/read`, {}).pipe(timeout(T));
  }

  markAllRead(): Observable<void> {
    return this.http.patch<void>(`${BASE}/read-all`, {}).pipe(timeout(T));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/${id}`).pipe(timeout(T));
  }
}
