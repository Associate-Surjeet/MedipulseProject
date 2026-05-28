import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CurrentUser } from '../../services/auth/auth.models';
import { getRoleDisplayName } from '../../shared/extensions/app.extensions';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: CurrentUser | null = null;
  activeDropdown: string | null = null;
  showMobileMenu = false;
  unreadCount = 0;
  private pollInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationSvc: NotificationService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadUnreadCount();
        // Poll every 15 seconds
        this.pollInterval = setInterval(() => this.loadUnreadCount(), 15_000);
      } else {
        clearInterval(this.pollInterval);
        this.unreadCount = 0;
      }
    });
  }

  ngOnDestroy(): void { clearInterval(this.pollInterval); }

  private loadUnreadCount() {
    this.notificationSvc.getUnreadCount().subscribe({
      next: (r) => this.unreadCount = r.count,
      error: () => {},
    });
  }

  // ── Role flags ──────────────────────────────────────────────────────────
  get role(): string { return this.currentUser?.role ?? ''; }
  get isAdmin()       { return this.role === 'Admin'; }
  get isSupply()      { return this.role === 'SupplyManager'; }
  get isPharmacy()    { return this.role === 'PharmacyManager'; }
  get isProcurement() { return this.role === 'ProcurementOfficer'; }
  get isColdChain()   { return this.role === 'ColdChainOperator'; }
  get isBiomedical()  { return this.role === 'DeviceManager'; }
  get isNursing()     { return this.role === 'Nurse'; }
  get isCompliance()  { return this.role === 'ComplianceOfficer'; }

  // ── Permission getters ──────────────────────────────────────────────────
  get canSeeFacilities()  { return this.isAdmin || this.isSupply || this.isPharmacy || this.isProcurement || this.isColdChain || this.isBiomedical || this.isCompliance; }
  get canSeeSuppliers()   { return this.isAdmin || this.isProcurement || this.isPharmacy || this.isCompliance; }
  get canSeeZones()       { return this.isAdmin || this.isSupply || this.isColdChain || this.isCompliance; }
  get canSeeItems()       { return this.isAdmin || this.isSupply || this.isPharmacy || this.isBiomedical || this.isCompliance; }
  get canSeeMasterData()  { return this.canSeeFacilities || this.canSeeSuppliers || this.canSeeZones || this.canSeeItems; }

  get canSeePOs()         { return this.isAdmin || this.isProcurement || this.isPharmacy || this.isSupply; }
  get canSeeReceipts()    { return this.isAdmin || this.isProcurement || this.isPharmacy; }
  get canSeeProcurement() { return this.canSeePOs || this.canSeeReceipts; }

  get canSeeStockPositions() { return this.isAdmin || this.isSupply || this.isPharmacy || this.isBiomedical || this.isNursing || this.isCompliance; }
  get canSeeExceptions()     { return this.isAdmin || this.isSupply || this.isPharmacy || this.isBiomedical || this.isCompliance; }
  get canSeeReplenishment()  { return this.isAdmin || this.isSupply || this.isPharmacy; }
  get canSeeInventory()      { return this.canSeeItems || this.canSeeStockPositions || this.canSeeExceptions || this.canSeeReplenishment; }

  get canSeeSensors()       { return this.isAdmin || this.isColdChain; }
  get canSeeTelemetryData() { return this.isAdmin || this.isColdChain || this.isCompliance; }
  get canSeeColdChain()     { return this.canSeeSensors || this.canSeeTelemetryData; }

  get canSeeTransfers()   { return this.isAdmin || this.isSupply || this.isBiomedical || this.isProcurement; }
  get canSeeConsumption() { return this.isAdmin || this.isSupply || this.isNursing || this.isPharmacy; }
  get canSeeDistrib()     { return this.canSeeTransfers || this.canSeeConsumption; }

  get canSeeAudit()       { return this.isAdmin || this.isCompliance; }

  get roleDisplayName(): string { return this.currentUser ? getRoleDisplayName(this.currentUser.role) : ''; }
  get dashboardRoute(): string  { return this.isAdmin ? '/admin/dashboard' : '/dashboard'; }

  // ── Dropdown control ────────────────────────────────────────────────────
  toggleDropdown(name: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }
  isOpen(name: string): boolean { return this.activeDropdown === name; }

  toggleMobileMenu(): void { this.showMobileMenu = !this.showMobileMenu; }

  @HostListener('document:click')
  onDocumentClick(): void { this.activeDropdown = null; }

  // ── Navigation ──────────────────────────────────────────────────────────
  navigate(route: string): void {
    this.activeDropdown = null;
    this.showMobileMenu = false;
    this.router.navigate([route]);
  }

  logout(): void { this.authService.logout(); }
}
