import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import {
  TransferOrderDto, CreateTransferOrderRequest, UpdateTransferStatusRequest,
  ConsumptionRecordDto, CreateConsumptionRequest, UpdateConsumptionRequest,
} from './logistics.models';

const BASE = '/api';
const T = 10_000;

@Injectable({ providedIn: 'root' })
export class LogisticsService {
  constructor(private http: HttpClient) {}

  // ── Transfer Orders ──────────────────────────────────────────────────────
  getTransferOrders(): Observable<TransferOrderDto[]> { return this.http.get<TransferOrderDto[]>(`${BASE}/transferorders`).pipe(timeout(T)); }
  getTransferOrder(id: number): Observable<TransferOrderDto> { return this.http.get<TransferOrderDto>(`${BASE}/transferorders/${id}`).pipe(timeout(T)); }
  getTransferOrdersByFacility(facilityId: number): Observable<TransferOrderDto[]> { return this.http.get<TransferOrderDto[]>(`${BASE}/transferorders/facility/${facilityId}`).pipe(timeout(T)); }
  createTransferOrder(req: CreateTransferOrderRequest): Observable<TransferOrderDto> { return this.http.post<TransferOrderDto>(`${BASE}/transferorders`, req).pipe(timeout(T)); }
  updateTransferStatus(id: number, req: UpdateTransferStatusRequest): Observable<TransferOrderDto> { return this.http.patch<TransferOrderDto>(`${BASE}/transferorders/${id}/status`, req).pipe(timeout(T)); }
  deleteTransferOrder(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/transferorders/${id}`).pipe(timeout(T)); }

  // ── Consumption Records ──────────────────────────────────────────────────
  getConsumptions(): Observable<ConsumptionRecordDto[]> { return this.http.get<ConsumptionRecordDto[]>(`${BASE}/consumption`).pipe(timeout(T)); }
  getConsumption(id: number): Observable<ConsumptionRecordDto> { return this.http.get<ConsumptionRecordDto>(`${BASE}/consumption/${id}`).pipe(timeout(T)); }
  createConsumption(req: CreateConsumptionRequest): Observable<ConsumptionRecordDto> { return this.http.post<ConsumptionRecordDto>(`${BASE}/consumption`, req).pipe(timeout(T)); }
  updateConsumption(id: number, req: UpdateConsumptionRequest): Observable<ConsumptionRecordDto> { return this.http.put<ConsumptionRecordDto>(`${BASE}/consumption/${id}`, req).pipe(timeout(T)); }
  deleteConsumption(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/consumption/${id}`).pipe(timeout(T)); }
}
