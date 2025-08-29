export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isDefault: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier?: string;
  brand?: string;
  barcode?: string;
  images: string[];
  attributes: Record<string, any>; // For custom attributes like frame size, lens type, etc.
  isActive: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string; // Purchase order, sale ID, etc.
  employeeId: string;
  storeId: string;
  createdAt: string;
}

export interface LensOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  prescription: string;
  lensType: 'single' | 'bifocal' | 'progressive' | 'reading';
  material: string;
  coating?: string[];
  status: 'pending' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDate: string;
  deliveredDate?: string;
  totalAmount: number;
  notes?: string;
  storeId: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'storeId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Lunettes',
    description: 'Eyewear frames',
    color: 'hsl(var(--primary))',
    icon: 'glasses',
    isDefault: true,
  },
  {
    name: 'Verres',
    description: 'Lenses (order-only)',
    color: 'hsl(var(--warning))',
    icon: 'eye',
    isDefault: true,
  },
  {
    name: 'Accessoires',
    description: 'Accessories and supplies',
    color: 'hsl(var(--accent))',
    icon: 'package',
    isDefault: true,
  },
  {
    name: 'Solaires',
    description: 'Sunglasses',
    color: 'hsl(var(--secondary))',
    icon: 'sun',
    isDefault: true,
  },
  {
    name: 'Entretien',
    description: 'Cleaning and maintenance',
    color: 'hsl(var(--muted-foreground))',
    icon: 'spray-can',
    isDefault: true,
  },
];