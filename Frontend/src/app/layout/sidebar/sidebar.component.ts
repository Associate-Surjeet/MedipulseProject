import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CurrentUser } from '../../services/auth/auth.models';
import {
  NavItem,
  getRoleConfig,
  RoleDashboardConfig,
} from '../../shared/extensions/app.extensions';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  currentUser: CurrentUser | null = null;
  config: RoleDashboardConfig | null = null;
  navItems: NavItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.config = getRoleConfig(user.role);
        this.navItems = this.config.navItems;
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
