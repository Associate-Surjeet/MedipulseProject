import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import {
  SensorDeviceDto, CreateSensorDeviceRequest, UpdateSensorDeviceRequest,
  TelemetryRecordDto, CreateTelemetryRecordRequest, UpdateTelemetryRecordRequest,
} from './telemetry.models';

const BASE = '/api';
const T = 8_000;

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  constructor(private http: HttpClient) {}

  // Sensor Devices
  getSensors(): Observable<SensorDeviceDto[]> { return this.http.get<SensorDeviceDto[]>(`${BASE}/sensordevices`).pipe(timeout(T)); }
  createSensor(req: CreateSensorDeviceRequest): Observable<SensorDeviceDto> { return this.http.post<SensorDeviceDto>(`${BASE}/sensordevices`, req).pipe(timeout(T)); }
  updateSensor(id: number, req: UpdateSensorDeviceRequest): Observable<SensorDeviceDto> { return this.http.put<SensorDeviceDto>(`${BASE}/sensordevices/${id}`, req).pipe(timeout(T)); }
  deleteSensor(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/sensordevices/${id}`).pipe(timeout(T)); }

  // Telemetry Records
  getRecords(): Observable<TelemetryRecordDto[]> { return this.http.get<TelemetryRecordDto[]>(`${BASE}/telemetry`).pipe(timeout(T)); }
  getExcursions(): Observable<TelemetryRecordDto[]> { return this.http.get<TelemetryRecordDto[]>(`${BASE}/telemetry/excursions`).pipe(timeout(T)); }
  createRecord(req: CreateTelemetryRecordRequest): Observable<TelemetryRecordDto> { return this.http.post<TelemetryRecordDto>(`${BASE}/telemetry`, req).pipe(timeout(T)); }
  updateRecord(id: number, req: UpdateTelemetryRecordRequest): Observable<TelemetryRecordDto> { return this.http.put<TelemetryRecordDto>(`${BASE}/telemetry/${id}`, req).pipe(timeout(T)); }
  deleteRecord(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/telemetry/${id}`).pipe(timeout(T)); }
}
