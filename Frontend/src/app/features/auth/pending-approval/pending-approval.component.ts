import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-approval.component.html',
  styleUrl: './pending-approval.component.css',
})
export class PendingApprovalComponent {
  userName: string = '';

  constructor(private authService: AuthService) {
    this.userName = this.authService.currentUser?.name ?? 'there';
  }

  logout(): void {
    this.authService.logout();
  }
}
