
import { Routes } from '@angular/router';
import { authGuard } from './shared/filters/auth.guard';
import { roleGuard } from './shared/filters/role.guard';

export const routes: Routes = [
  { path: 'login',    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: '',         redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'pending-approval',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/pending-approval/pending-approval.component').then(m => m.PendingApprovalComponent),
  },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard',  loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'users',      loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent) },
      { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Shared role dashboard
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/role-dashboard/role-dashboard.component').then(m => m.RoleDashboardComponent),
  },

  // Facility
  {
    path: 'facility',
    canActivate: [authGuard],
    children: [
      { path: 'facilities',    loadComponent: () => import('./features/facility/facilities/facilities.component').then(m => m.FacilitiesComponent) },
      { path: 'storage-zones', loadComponent: () => import('./features/facility/storage-zones/storage-zones.component').then(m => m.StorageZonesComponent) },
      { path: '',              redirectTo: 'facilities', pathMatch: 'full' },
    ],
  },

  // Procurement
  {
    path: 'procurement',
    canActivate: [authGuard],
    children: [
      { path: 'suppliers',       loadComponent: () => import('./features/procurement/suppliers/suppliers.component').then(m => m.SuppliersComponent) },
      { path: 'purchase-orders', loadComponent: () => import('./features/procurement/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent) },
      { path: 'receipts',        loadComponent: () => import('./features/procurement/receipts/receipts.component').then(m => m.ReceiptsComponent) },
      { path: '',                redirectTo: 'suppliers', pathMatch: 'full' },
    ],
  },

  // Telemetry
  {
    path: 'telemetry',
    canActivate: [authGuard],
    children: [
      { path: 'sensors', loadComponent: () => import('./features/telemetry/sensor-devices/sensor-devices.component').then(m => m.SensorDevicesComponent) },
      { path: 'records', loadComponent: () => import('./features/telemetry/telemetry-records/telemetry-records.component').then(m => m.TelemetryRecordsComponent) },
      { path: '',        redirectTo: 'sensors', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
