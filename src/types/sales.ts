export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  productType: 'product' | 'contact_lens';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'cheque';
  status: 'completed' | 'pending' | 'refunded';
  notes?: string;
  createdAt: Date;
  createdBy: string;
  storeId: string;
}

export interface SaleFormData {
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  items: Omit<SaleItem, 'id' | 'totalPrice'>[];
  discount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'cheque';
  notes?: string;
}