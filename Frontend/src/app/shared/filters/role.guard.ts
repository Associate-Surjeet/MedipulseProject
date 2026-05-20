import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Frontend equivalent of RoleAuthorizeFilter.cs
 * Usage in routes: { data: { roles: ['Admin'] } }
 * Returns 401 redirect if not authenticated, 403 redirect if wrong role.
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: string[] = route.data['roles'] || [];
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(currentUser.role)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
