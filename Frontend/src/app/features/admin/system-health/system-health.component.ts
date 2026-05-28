import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, timeout, map } from 'rxjs/operators';

interface ServiceStatus {
  name: string;
  description: string;
  probeUrl: string;
  port: number;
  status: 'checking' | 'online' | 'offline';
  latencyMs: number | null;
}

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './system-health.component.html',
  styleUrl: './system-health.component.css',
})
export class SystemHealthComponent implements OnInit {
  services: ServiceStatus[] = [
    { name: 'Auth Service',          description: 'User authentication & role management', probeUrl: '/api/users',          port: 5001, status: 'checking', latencyMs: null },
    { name: 'Facility Service',      description: 'Facilities & storage zones',            probeUrl: '/api/facilities',     port: 5002, status: 'checking', latencyMs: null },
    { name: 'Inventory Service',     description: 'Items, stock positions & exceptions',   probeUrl: '/api/items',          port: 5003, status: 'checking', latencyMs: null },
    { name: 'Procurement Service',   description: 'Suppliers, purchase orders & receipts', probeUrl: '/api/suppliers',      port: 5004, status: 'checking', latencyMs: null },
    { name: 'Logistics Service',     description: 'Transfer orders & consumption',          probeUrl: '/api/transferorders', port: 5005, status: 'checking', latencyMs: null },
    { name: 'Telemetry Service',     description: 'IoT sensors & telemetry records',        probeUrl: '/api/sensordevices',  port: 5006, status: 'checking', latencyMs: null },
    { name: 'Notification Service',  description: 'Alerts & system notifications',          probeUrl: '/api/notifications',  port: 5007, status: 'checking', latencyMs: null },
    { name: 'Audit Service',         description: 'Audit trail & compliance log',           probeUrl: '/api/audit',          port: 5008, status: 'checking', latencyMs: null },
  ];

  isChecking = false;
  lastChecked: Date | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() { this.checkAll(); }

  checkAll() {
    this.isChecking = true;
    this.services.forEach(s => { s.status = 'checking'; s.latencyMs = null; });

    let pending = this.services.length;
    const done = () => { if (--pending === 0) { this.isChecking = false; this.lastChecked = new Date(); } };

    this.services.forEach(s => {
      const t0 = Date.now();
      this.http.get(s.probeUrl).pipe(
        timeout(6000),
        map(() => ({ ok: true,  ms: Date.now() - t0 })),
        catchError(() => of({ ok: false, ms: Date.now() - t0 })),
      ).subscribe(r => { s.status = r.ok ? 'online' : 'offline'; s.latencyMs = r.ms; done(); });
    });
  }

  latencyClass(ms: number | null): string {
    if (ms === null) return 'text-muted';
    if (ms < 300)   return 'text-success';
    if (ms < 1000)  return 'text-warning';
    return 'text-danger';
  }

  get onlineCount()   { return this.services.filter(s => s.status === 'online').length; }
  get offlineCount()  { return this.services.filter(s => s.status === 'offline').length; }
  get checkingCount() { return this.services.filter(s => s.status === 'checking').length; }
  get allOnline()     { return this.offlineCount === 0 && this.checkingCount === 0; }
}
