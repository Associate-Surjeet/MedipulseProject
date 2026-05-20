import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserDto } from '../../../services/auth/auth.models';
import { getAllRoles, getRoleDisplayName } from '../../../shared/extensions/app.extensions';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  users: UserDto[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users.';
        this.isLoading = false;
      },
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get adminCount(): number {
    return this.users.filter((u) => u.role === 'Admin').length;
  }

  get roleBreakdown(): { role: string; display: string; count: number; color: string }[] {
    const colors: Record<string, string> = {
      Admin: '#dc2626', SupplyManager: '#2563eb', PharmacyManager: '#7c3aed',
      DeviceManager: '#0891b2', ProcurementOfficer: '#d97706',
      ColdChainOperator: '#0284c7', Nurse: '#059669', ComplianceOfficer: '#64748b',
    };
    return getAllRoles().map((role) => ({
      role,
      display: getRoleDisplayName(role),
      count: this.users.filter((u) => u.role === role).length,
      color: colors[role] ?? '#6b7280',
    }));
  }

  getRoleDisplayName(role: string): string {
    return getRoleDisplayName(role);
  }

  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      Admin: 'badge--red', SupplyManager: 'badge--blue', PharmacyManager: 'badge--purple',
      DeviceManager: 'badge--cyan', ProcurementOfficer: 'badge--amber',
      ColdChainOperator: 'badge--sky', Nurse: 'badge--green', ComplianceOfficer: 'badge--slate',
    };
    return map[role] ?? 'badge--slate';
  }
}
