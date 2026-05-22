import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import {
  FacilityDto, CreateFacilityRequest, UpdateFacilityRequest,
  StorageZoneDto, CreateStorageZoneRequest, UpdateStorageZoneRequest,
} from './facility.models';

const BASE = '/api';
const T = 8_000;

@Injectable({ providedIn: 'root' })
export class FacilityService {
  constructor(private http: HttpClient) {}

  // Facilities
  getFacilities(): Observable<FacilityDto[]> { return this.http.get<FacilityDto[]>(`${BASE}/facilities`).pipe(timeout(T)); }
  getFacility(id: number): Observable<FacilityDto> { return this.http.get<FacilityDto>(`${BASE}/facilities/${id}`).pipe(timeout(T)); }
  createFacility(req: CreateFacilityRequest): Observable<FacilityDto> { return this.http.post<FacilityDto>(`${BASE}/facilities`, req).pipe(timeout(T)); }
  updateFacility(id: number, req: UpdateFacilityRequest): Observable<FacilityDto> { return this.http.put<FacilityDto>(`${BASE}/facilities/${id}`, req).pipe(timeout(T)); }
  deleteFacility(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/facilities/${id}`).pipe(timeout(T)); }
  getZonesByFacility(id: number): Observable<StorageZoneDto[]> { return this.http.get<StorageZoneDto[]>(`${BASE}/facilities/${id}/zones`).pipe(timeout(T)); }

  // Storage Zones
  getZones(): Observable<StorageZoneDto[]> { return this.http.get<StorageZoneDto[]>(`${BASE}/storagezones`).pipe(timeout(T)); }
  getZone(id: number): Observable<StorageZoneDto> { return this.http.get<StorageZoneDto>(`${BASE}/storagezones/${id}`).pipe(timeout(T)); }
  createZone(req: CreateStorageZoneRequest): Observable<StorageZoneDto> { return this.http.post<StorageZoneDto>(`${BASE}/storagezones`, req).pipe(timeout(T)); }
  updateZone(id: number, req: UpdateStorageZoneRequest): Observable<StorageZoneDto> { return this.http.put<StorageZoneDto>(`${BASE}/storagezones/${id}`, req).pipe(timeout(T)); }
  deleteZone(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/storagezones/${id}`).pipe(timeout(T)); }
}
