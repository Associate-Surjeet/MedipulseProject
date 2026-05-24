import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../services/auth/auth.service';
import { ProcurementService } from '../../../services/procurement/procurement.service';
import { TelemetryService } from '../../../services/telemetry/telemetry.service';
import { FacilityService } from '../../../services/facility/facility.service';
import { CurrentUser } from '../../../services/auth/auth.models';
import { getRoleConfig, getRoleDisplayName, RoleDashboardConfig } from '../../../shared/extensions/app.extensions';

interface DashboardKpi {
  label: string;
  value: number;
  foot: string;
}

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
  isLoading = true;
  kpis: DashboardKpi[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private procurementService: ProcurementService,
    private telemetryService: TelemetryService,
    private facilityService: FacilityService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (this.currentUser) {
      this.config = getRoleConfig(this.currentUser.role);
      this.loadKpis(this.currentUser.role);
    }
  }

  private safe<T>(obs: Observable<T>, fallback: T): Observable<T> {
    return obs.pipe(catchError(() => of(fallback)));
  }

  private loadKpis(role: string): void {
    switch (role) {

      // ── Procurement Officer & Pharmacy Manager ────────────────────────────
      case 'ProcurementOfficer':
      case 'PharmacyManager':
        forkJoin({
          suppliers: this.safe(this.procurementService.getSuppliers(), []),
          orders:    this.safe(this.procurementService.getPurchaseOrders(), []),
          receipts:  this.safe(this.procurementService.getReceipts(), []),
        }).subscribe(({ suppliers, orders, receipts }) => {
          this.kpis = [
            {
              label: 'Active suppliers',
              value: suppliers.filter(s => s.status === 'Active').length,
              foot:  'Ready to order from',
            },
            {
              label: 'Open orders',
              value: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
              foot:  'Not yet delivered',
            },
            {
              label: 'Awaiting delivery',
              value: orders.filter(o => o.receiptCount === 0 && o.status !== 'Cancelled').length,
              foot:  'No receipt recorded yet',
            },
            {
              label: 'Quality issues',
              value: receipts.filter(r => r.qualityStatus === 'Rejected' || r.qualityStatus === 'Failed').length,
              foot:  'Rejected receipts',
            },
          ];
          this.isLoading = false;
        });
        break;

      // ── Supply Manager ────────────────────────────────────────────────────
      case 'SupplyManager':
        forkJoin({
          facilities: this.safe(this.facilityService.getFacilities(), []),
          zones:      this.safe(this.facilityService.getZones(), []),
          orders:     this.safe(this.procurementService.getPurchaseOrders(), []),
          suppliers:  this.safe(this.procurementService.getSuppliers(), []),
        }).subscribe(({ facilities, zones, orders, suppliers }) => {
          this.kpis = [
            {
              label: 'Facilities',
              value: facilities.length,
              foot:  'All locations',
            },
            {
              label: 'Storage zones',
              value: zones.length,
              foot:  'Across all facilities',
            },
            {
              label: 'Open orders',
              value: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
              foot:  'Not yet delivered',
            },
            {
              label: 'Active suppliers',
              value: suppliers.filter(s => s.status === 'Active').length,
              foot:  'Ready to order from',
            },
          ];
          this.isLoading = false;
        });
        break;

      // ── Cold Chain Operator ───────────────────────────────────────────────
      case 'ColdChainOperator':
        forkJoin({
          sensors:    this.safe(this.telemetryService.getSensors(), []),
          excursions: this.safe(this.telemetryService.getExcursions(), []),
        }).subscribe(({ sensors, excursions }) => {
          this.kpis = [
            {
              label: 'Total sensors',
              value: sensors.length,
              foot:  'All registered devices',
            },
            {
              label: 'Online',
              value: sensors.filter(s => s.status === 'Active').length,
              foot:  'Reporting normally',
            },
            {
              label: 'In maintenance',
              value: sensors.filter(s => s.status === 'Maintenance').length,
              foot:  'Under service',
            },
            {
              label: 'Excursions',
              value: excursions.length,
              foot:  'Temperature breaches',
            },
          ];
          this.isLoading = false;
        });
        break;

      // ── Compliance Officer ────────────────────────────────────────────────
      case 'ComplianceOfficer':
        forkJoin({
          facilities: this.safe(this.facilityService.getFacilities(), []),
          zones:      this.safe(this.facilityService.getZones(), []),
          sensors:    this.safe(this.telemetryService.getSensors(), []),
          excursions: this.safe(this.telemetryService.getExcursions(), []),
        }).subscribe(({ facilities, zones, sensors, excursions }) => {
          this.kpis = [
            {
              label: 'Facilities',
              value: facilities.length,
              foot:  'All locations',
            },
            {
              label: 'Storage zones',
              value: zones.length,
              foot:  'Across all facilities',
            },
            {
              label: 'Active sensors',
              value: sensors.filter(s => s.status === 'Active').length,
              foot:  'Reporting normally',
            },
            {
              label: 'Excursions',
              value: excursions.length,
              foot:  'Temperature breaches logged',
            },
          ];
          this.isLoading = false;
        });
        break;

      // ── Device Manager ────────────────────────────────────────────────────
      case 'DeviceManager':
        forkJoin({
          facilities: this.safe(this.facilityService.getFacilities(), []),
          zones:      this.safe(this.facilityService.getZones(), []),
        }).subscribe(({ facilities, zones }) => {
          this.kpis = [
            {
              label: 'Facilities',
              value: facilities.length,
              foot:  'All locations',
            },
            {
              label: 'Storage zones',
              value: zones.length,
              foot:  'Across all facilities',
            },
          ];
          this.isLoading = false;
        });
        break;

      default:
        this.isLoading = false;
        break;
    }
  }

  get kpisColClass(): string {
    if (this.kpis.length === 2) return 'mp-kpis cols-2';
    if (this.kpis.length === 3) return 'mp-kpis cols-3';
    return 'mp-kpis';
  }

  get roleDisplayName(): string {
    return this.currentUser ? getRoleDisplayName(this.currentUser.role) : '';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}
