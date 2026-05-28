export interface SupplierDto {
  supplierId: number;
  name: string;
  supplierType?: string;
  status: string;
}
export interface CreateSupplierRequest { name: string; supplierType: string; status?: string; }
export interface UpdateSupplierRequest { name: string; supplierType: string; status: string; }

export interface PurchaseOrderDto {
  poId: number;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: string;
  notes?: string;
  receiptCount: number;
}
export interface CreatePurchaseOrderRequest { supplierId: number; orderDate: string; expectedDeliveryDate?: string; notes?: string; }
export interface UpdatePurchaseOrderRequest { supplierId: number; orderDate: string; expectedDeliveryDate?: string; notes?: string; }
export interface UpdatePoStatusRequest { status: string; }

export interface ReceiptDto {
  receiptId: number;
  poId: number;
  supplierLot?: string;
  receivedDate: string;
  receivedBy: string;
  qualityStatus: string;
  quantityReceived: number;
  supplierName: string;
}
export interface CreateReceiptRequest { poId: number; supplierLot?: string; receivedDate: string; receivedBy: string; qualityStatus: string; quantityReceived: number; }
export interface UpdateReceiptRequest { supplierLot?: string; receivedDate: string; receivedBy: string; qualityStatus: string; quantityReceived: number; }
