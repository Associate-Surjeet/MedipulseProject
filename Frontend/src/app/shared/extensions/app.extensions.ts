/**
 * Frontend equivalent of Shared/Constants/Roles.cs and Shared/Enums/UserRole.cs
 * Mirrors all role strings defined in the backend.
 */
export const ROLES = {
  Admin: 'Admin',
  SupplyManager: 'SupplyManager',
  PharmacyManager: 'PharmacyManager',
  DeviceManager: 'DeviceManager',
  ProcurementOfficer: 'ProcurementOfficer',
  ColdChainOperator: 'ColdChainOperator',
  Nurse: 'Nurse',
  ComplianceOfficer: 'ComplianceOfficer',
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export interface RoleDashboardConfig {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  navItems: NavItem[];
  kpiCards: KpiCard[];
}

export interface KpiCard {
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const ROLE_DASHBOARD_CONFIG: Record<string, RoleDashboardConfig> = {
  Admin: {
    title: 'Admin Console',
    subtitle: 'Full system control and user management',
    icon: 'admin_panel_settings',
    color: '#dc2626',
    navItems: [
      { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
      { label: 'User Management', icon: 'manage_accounts', route: '/admin/users' },
      { label: 'Master Data', icon: 'storage', route: '/admin/master-data' },
      { label: 'System Health', icon: 'monitor_heart', route: '/admin/health' },
      { label: 'Audit Logs', icon: 'history', route: '/admin/audit' },
    ],
    kpiCards: [
      { label: 'Total Users', icon: 'people', description: 'All registered users', color: '#2563eb' },
      { label: 'Active Sessions', icon: 'login', description: 'Currently logged in', color: '#059669' },
      { label: 'System Alerts', icon: 'notifications_active', description: 'Pending alerts', color: '#dc2626' },
      { label: 'Audit Events', icon: 'fact_check', description: 'Last 24 hours', color: '#7c3aed' },
    ],
  },
  SupplyManager: {
    title: 'Control Tower',
    subtitle: 'Hospital-wide inventory and replenishment overview',
    icon: 'control_camera',
    color: '#2563eb',
    navItems: [
      { label: 'Control Tower', icon: 'control_camera', route: '/dashboard' },
      { label: 'Inventory', icon: 'inventory_2', route: '/dashboard' },
      { label: 'Replenishment', icon: 'autorenew', route: '/dashboard' },
      { label: 'Expiry Tracking', icon: 'schedule', route: '/dashboard' },
      { label: 'Exceptions', icon: 'warning_amber', route: '/dashboard' },
    ],
    kpiCards: [
      { label: 'Days of Stock', icon: 'event_available', description: 'Avg across facilities', color: '#2563eb' },
      { label: 'Expiry Risk Items', icon: 'schedule', description: 'Expiring in 30 days', color: '#f59e0b' },
      { label: 'Stockouts', icon: 'remove_shopping_cart', description: 'Active stockouts', color: '#dc2626' },
      { label: 'Replenishment Due', icon: 'autorenew', description: 'Pending orders', color: '#059669' },
    ],
  },
  PharmacyManager: {
    title: 'Pharmacy Dashboard',
    subtitle: 'Drug inventory, lot control, and regulatory reporting',
    icon: 'local_pharmacy',
    color: '#7c3aed',
    navItems: [
      { label: 'Pharmacy Dashboard', icon: 'local_pharmacy', route: '/dashboard' },
      { label: 'Drug Inventory', icon: 'medication', route: '/dashboard' },
      { label: 'Lot Control', icon: 'qr_code', route: '/dashboard' },
      { label: 'Quality Holds', icon: 'verified_user', route: '/dashboard' },
      { label: 'Regulatory Reports', icon: 'summarize', route: '/dashboard' },
    ],
    kpiCards: [
      { label: 'Drug SKUs', icon: 'medication', description: 'Total active drugs', color: '#7c3aed' },
      { label: 'Expiring Lots', icon: 'warning', description: 'Within 60 days', color: '#f59e0b' },
      { label: 'Quality Holds', icon: 'block', description: 'Items on hold', color: '#dc2626' },
      { label: 'Receipts Today', icon: 'move_to_inbox', description: 'Incoming batches', color: '#059669' },
    ],
  },
  DeviceManager: {
    title: 'Device Management',
    subtitle: 'Medical device inventory, maintenance, and recalls',
    icon: 'medical_services',
    color: '#0891b2',
    navItems: [
      { label: 'Device Dashboard', icon: 'devices', route: '/dashboard' },
      { label: 'Device Inventory', icon: 'medical_services', route: '/dashboard' },
      { label: 'Maintenance', icon: 'build', route: '/dashboard' },
      { label: 'Recalls', icon: 'report', route: '/dashboard' },
      { label: 'Calibration', icon: 'tune', route: '/dashboard' },
    ],
    kpiCards: [
      { label: 'Total Devices', icon: 'devices', description: 'All tracked devices', color: '#0891b2' },
      { label: 'Due Maintenance', icon: 'build', description: 'Overdue / upcoming', color: '#f59e0b' },
      { label: 'Active Recalls', icon: 'report', description: 'Open recall actions', color: '#dc2626' },
      { label: 'Calibration Due', icon: 'tune', description: 'Pending calibration', color: '#7c3aed' },
    ],
  },
  ProcurementOfficer: {
    title: 'Procurement Dashboard',
    subtitle: 'Purchase orders, receipts, and supplier management',
    icon: 'shopping_cart',
    color: '#d97706',
    navItems: [
      { label: 'Procurement Dashboard', icon: 'shopping_cart', route: '/dashboard' },
      { label: 'Purchase Orders', icon: 'receipt_long', route: '/dashboard' },
      { label: 'Receipts & GRN', icon: 'move_to_inbox', route: '/dashboard' },
      { label: 'Suppliers', icon: 'business', route: '/dashboard' },
      { label: 'ASN Tracking', icon: 'local_shipping', route: '/dashboard' },
    ],
    kpiCards: [
      { label: 'Open POs', icon: 'receipt_long', description: 'Pending purchase orders', color: '#d97706' },
      { label: 'Expected Deliveries', icon: 'local_shipping', description: 'Due this week', color: '#2563eb' },
      { label: 'GRN Pending', icon: 'move_to_inbox', description: 'Awaiting receipt', color: '#f59e0b' },
      { label: 'Supplier Issues', icon: 'business_center', description: 'Quality flags', color: '#dc2626' },
    ],
  },
  ColdChainOperator: {
    title: 'Cold Chain Dashboard',
    subtitle: 'Temperature monitoring, sensors, and excursion management',
    icon: 'ac_unit',
    color: '#0284c7',
    navItems: [
      { label: 'Cold Chain Dashboard', icon: 'ac_unit', route: '/dashboard' },
      { label: 'Active Shipments', icon: 'local_shipping', route: '/dashboard' },
      { label: 'Sensor Status', icon: 'sensors', route: '/dashboard' },
      { label: 'Excursions', icon: 'thermostat', route: '/dashboard' },
      { label: 'Corrective Actions', icon: 'healing', route: '/dashboard' },
    ],
    kpiCards: [
      { label: 'Active Shipments', icon: 'local_shipping', description: 'In-transit cold chain', color: '#0284c7' },
      { label: 'Sensors Online', icon: 'sensors', description: 'Reporting normally', color: '#059669' },
      { label: 'Excursions', icon: 'thermostat', description: 'Temperature breaches', color: '#dc2626' },
      { label: 'Corrective Actions', icon: 'healing', description: 'Open actions', color: '#f59e0b' },
    ],
  },
  Nurse: {
    title: 'Ward Dashboard',
    subtitle: 'Local stock view, requisitions, and consumption tracking',
    icon: 'local_hospital',
    color: '#059669',
    navItems: [
      { label: 'Ward Dashboard', icon: 'local_hospital', route: '/dashboard' },
      { label: 'Local Stock', icon: 'inventory', route: '/dashboard' },
      { label: 'Requisitions', icon: 'add_shopping_cart', route: '/dashboard' },
      { label: 'Consumption Log', icon: 'list_alt', route: '/dashboard' },
      { label: 'Replenishment ETA', icon: 'access_time', route: '/dashboard' },
    ],
    kpiCards: [
      { label: 'Ward Stock Items', icon: 'inventory', description: 'Items available', color: '#059669' },
      { label: 'Low Stock Alerts', icon: 'warning', description: 'Below minimum', color: '#f59e0b' },
      { label: 'Open Requisitions', icon: 'add_shopping_cart', description: 'Awaiting fulfillment', color: '#2563eb' },
      { label: 'Next Replenishment', icon: 'access_time', description: 'Expected ETA', color: '#7c3aed' },
    ],
  },
  ComplianceOfficer: {
    title: 'Compliance Dashboard',
    subtitle: 'Audit trails, recall actions, and regulatory exports',
    icon: 'policy',
    color: '#64748b',
    navItems: [
      { label: 'Compliance Dashboard', icon: 'policy', route: '/dashboard' },
      { label: 'Audit Trail', icon: 'fact_check', route: '/dashboard' },
      { label: 'Recall Actions', icon: 'report_problem', route: '/dashboard' },
      { label: 'Regulatory Exports', icon: 'file_download', route: '/dashboard' },
    ],
    kpiCards: [
      { label: 'Audit Events', icon: 'fact_check', description: 'Last 30 days', color: '#64748b' },
      { label: 'Open Recalls', icon: 'report_problem', description: 'Pending resolution', color: '#dc2626' },
      { label: 'Compliance Flags', icon: 'flag', description: 'Regulatory issues', color: '#f59e0b' },
      { label: 'Reports Ready', icon: 'file_download', description: 'Ready for export', color: '#059669' },
    ],
  },
};

export function getRoleDashboardRoute(role: string): string {
  return role === 'Admin' ? '/admin/dashboard' : '/dashboard';
}

export function getRoleConfig(role: string): RoleDashboardConfig {
  return (
    ROLE_DASHBOARD_CONFIG[role] ?? {
      title: 'Dashboard',
      subtitle: 'Welcome to MediPulse',
      icon: 'dashboard',
      color: '#6b7280',
      navItems: [],
      kpiCards: [],
    }
  );
}

export function getRoleDisplayName(role: string): string {
  const names: Record<string, string> = {
    Admin: 'Administrator',
    SupplyManager: 'Supply Manager',
    PharmacyManager: 'Pharmacy Manager',
    DeviceManager: 'Device Manager',
    ProcurementOfficer: 'Procurement Officer',
    ColdChainOperator: 'Cold Chain Operator',
    Nurse: 'Nursing Staff',
    ComplianceOfficer: 'Compliance Officer',
  };
  return names[role] ?? role;
}

export function getAllRoles(): string[] {
  return Object.values(ROLES);
}
