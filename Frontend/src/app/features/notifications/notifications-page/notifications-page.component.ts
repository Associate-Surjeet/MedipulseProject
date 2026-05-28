import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification/notification.service';
import { NotificationDto } from '../../../services/notification/notification.models';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css',
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  notifications: NotificationDto[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  categoryFilter = '';
  isReadFilter: string = '';   // '', 'true', 'false'
  isMarkingAll = false;

  categories = ['Exception', 'Expiry', 'Receipt', 'Replenishment', 'SystemAlert'];

  private pollInterval: any;

  constructor(private svc: NotificationService) {}

  ngOnInit() {
    this.load();
    // Refresh every 15 s so new notifications appear while on this page
    this.pollInterval = setInterval(() => this.load(), 15_000);
  }

  ngOnDestroy() { clearInterval(this.pollInterval); }

  load() {
    this.isLoading = true;
    const params: any = {};
    if (this.categoryFilter) params.category = this.categoryFilter;
    if (this.isReadFilter !== '') params.isRead = this.isReadFilter === 'true';
    this.svc.getNotifications(params).subscribe({
      next: (d) => { this.notifications = d; this.isLoading = false; },
      error: () => { this.errorMessage = 'Failed to load notifications.'; this.isLoading = false; },
    });
  }

  markRead(n: NotificationDto) {
    if (n.isRead) return;
    this.svc.markRead(n.notificationId).subscribe({
      next: (updated) => { n.isRead = updated.isRead; },
    });
  }

  markAllRead() {
    this.isMarkingAll = true;
    this.svc.markAllRead().subscribe({
      next: () => { this.isMarkingAll = false; this.showSuccess('All notifications marked as read.'); this.load(); },
      error: () => { this.isMarkingAll = false; },
    });
  }

  delete(id: number) {
    this.svc.delete(id).subscribe({
      next: () => { this.notifications = this.notifications.filter(n => n.notificationId !== id); },
    });
  }

  categoryClass(c: string) {
    return { Exception: 'bg-danger', Expiry: 'bg-warning', Receipt: 'bg-success', Replenishment: 'bg-primary', SystemAlert: 'bg-secondary' }[c] ?? 'bg-secondary';
  }

  categoryIcon(c: string) {
    return { Exception: 'bi-exclamation-triangle-fill', Expiry: 'bi-clock-fill', Receipt: 'bi-inbox-fill', Replenishment: 'bi-arrow-repeat', SystemAlert: 'bi-bell-fill' }[c] ?? 'bi-bell';
  }

  private showSuccess(msg: string) { this.successMessage = msg; setTimeout(() => this.successMessage = '', 3500); }

  get unreadCount() { return this.notifications.filter(n => !n.isRead).length; }
}
