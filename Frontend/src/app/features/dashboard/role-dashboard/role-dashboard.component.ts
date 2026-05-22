import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { CurrentUser } from '../../../services/auth/auth.models';
import { getRoleConfig, getRoleDisplayName, RoleDashboardConfig } from '../../../shared/extensions/app.extensions';

@Component({
  selector: 'app-role-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-dashboard.component.html',
  styleUrl: './role-dashboard.component.css',
})
export class RoleDashboardComponent implements OnInit {
  currentUser: CurrentUser | null = null;
  config: RoleDashboardConfig | null = null;
  currentDate = new Date();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (this.currentUser) {
      this.config = getRoleConfig(this.currentUser.role);
    }
  }

  get roleDisplayName(): string {
    return this.currentUser ? getRoleDisplayName(this.currentUser.role) : '';
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}
