
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
      { path: 'health',     loadComponent: () => import('./features/admin/system-health/system-health.component').then(m => m.SystemHealthComponent) },
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

  // Inventory
  {
    path: 'inventory',
    canActivate: [authGuard],
    children: [
      { path: 'items',          loadComponent: () => import('./features/inventory/items/items.component').then(m => m.ItemsComponent) },
      { path: 'stock-positions',loadComponent: () => import('./features/inventory/stock-positions/stock-positions.component').then(m => m.StockPositionsComponent) },
      { path: 'exceptions',     loadComponent: () => import('./features/inventory/exceptions/exceptions.component').then(m => m.ExceptionsComponent) },
      { path: 'replenishment',  loadComponent: () => import('./features/inventory/replenishment/replenishment.component').then(m => m.ReplenishmentComponent) },
      { path: '',               redirectTo: 'items', pathMatch: 'full' },
    ],
  },

  // Logistics / Distribution
  {
    path: 'distribution',
    canActivate: [authGuard],
    children: [
      { path: 'transfer-orders', loadComponent: () => import('./features/logistics/transfer-orders/transfer-orders.component').then(m => m.TransferOrdersComponent) },
      { path: 'consumption',     loadComponent: () => import('./features/logistics/consumption/consumption.component').then(m => m.ConsumptionComponent) },
      { path: '',                redirectTo: 'transfer-orders', pathMatch: 'full' },
    ],
  },

  // Notifications
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./features/notifications/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent),
  },

  // Audit log — Admin + ComplianceOfficer
  {
    path: 'audit',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'ComplianceOfficer'] },
    loadComponent: () => import('./features/audit/audit-log/audit-log.component').then(m => m.AuditLogComponent),
  },

  { path: '**', redirectTo: 'login' },
];
