import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CurrentUser } from '../../services/auth/auth.models';
import { getRoleDisplayName } from '../../shared/extensions/app.extensions';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  currentUser: CurrentUser | null = null;
  showUserMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  get roleDisplayName(): string {
    return this.currentUser ? getRoleDisplayName(this.currentUser.role) : '';
  }

  get userInitials(): string {
    if (!this.currentUser?.name) return 'U';
    return this.currentUser.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.mp-user-menu')) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
  }
}
