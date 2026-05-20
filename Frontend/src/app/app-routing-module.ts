import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/filters/auth.guard';
import { RoleGuard } from './shared/filters/role.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { RoleDashboardComponent } from './features/dashboard/role-dashboard/role-dashboard.component';

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '',         redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users',     component: UserManagementComponent },
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  {
    path: 'dashboard',
    component: RoleDashboardComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
