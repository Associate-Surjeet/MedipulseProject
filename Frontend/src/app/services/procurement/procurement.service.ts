import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import {
  SupplierDto, CreateSupplierRequest, UpdateSupplierRequest,
  PurchaseOrderDto, CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest, UpdatePoStatusRequest,
  ReceiptDto, CreateReceiptRequest, UpdateReceiptRequest,
} from './procurement.models';

const BASE = '/api';
const T = 8_000;

@Injectable({ providedIn: 'root' })
export class ProcurementService {
  constructor(private http: HttpClient) {}

  // Suppliers
  getSuppliers(): Observable<SupplierDto[]> { return this.http.get<SupplierDto[]>(`${BASE}/suppliers`).pipe(timeout(T)); }
  createSupplier(req: CreateSupplierRequest): Observable<SupplierDto> { return this.http.post<SupplierDto>(`${BASE}/suppliers`, req).pipe(timeout(T)); }
  updateSupplier(id: number, req: UpdateSupplierRequest): Observable<SupplierDto> { return this.http.put<SupplierDto>(`${BASE}/suppliers/${id}`, req).pipe(timeout(T)); }
  deleteSupplier(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/suppliers/${id}`).pipe(timeout(T)); }

  // Purchase Orders
  getPurchaseOrders(): Observable<PurchaseOrderDto[]> { return this.http.get<PurchaseOrderDto[]>(`${BASE}/purchaseorders`).pipe(timeout(T)); }
  createPurchaseOrder(req: CreatePurchaseOrderRequest): Observable<PurchaseOrderDto> { return this.http.post<PurchaseOrderDto>(`${BASE}/purchaseorders`, req).pipe(timeout(T)); }
  updatePurchaseOrder(id: number, req: UpdatePurchaseOrderRequest): Observable<PurchaseOrderDto> { return this.http.put<PurchaseOrderDto>(`${BASE}/purchaseorders/${id}`, req).pipe(timeout(T)); }
  updatePoStatus(id: number, req: UpdatePoStatusRequest): Observable<PurchaseOrderDto> { return this.http.patch<PurchaseOrderDto>(`${BASE}/purchaseorders/${id}/status`, req).pipe(timeout(T)); }
  deletePurchaseOrder(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/purchaseorders/${id}`).pipe(timeout(T)); }

  // Receipts
  getReceipts(): Observable<ReceiptDto[]> { return this.http.get<ReceiptDto[]>(`${BASE}/receipts`).pipe(timeout(T)); }
  createReceipt(req: CreateReceiptRequest): Observable<ReceiptDto> { return this.http.post<ReceiptDto>(`${BASE}/receipts`, req).pipe(timeout(T)); }
  updateReceipt(id: number, req: UpdateReceiptRequest): Observable<ReceiptDto> { return this.http.put<ReceiptDto>(`${BASE}/receipts/${id}`, req).pipe(timeout(T)); }
  deleteReceipt(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/receipts/${id}`).pipe(timeout(T)); }
}
