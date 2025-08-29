export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  productType: 'product' | 'contact_lens';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'cheque';
  date: Date;
  notes?: string;
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
  amountPaid: number;
  remainingBalance: number;
  payments: PaymentRecord[];
  status: 'completed' | 'pending' | 'refunded' | 'partial';
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
  initialPayment: number;
  notes?: string;
}