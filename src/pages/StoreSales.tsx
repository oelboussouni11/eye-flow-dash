import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Filter, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SaleFormModal } from '@/components/sales/SaleFormModal';
import { SalesTable } from '@/components/sales/SalesTable';
import { SaleViewModal } from '@/components/sales/SaleViewModal';
import { PaymentModal } from '@/components/sales/PaymentModal';
import { useAuth } from '@/contexts/AuthContext';
import { Sale, SaleFormData, PaymentRecord } from '@/types/sales';
import { Product, ContactLens, DEFAULT_CATEGORIES } from '@/types/inventory';
import { toast } from 'sonner';

export const StoreSales: React.FC = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contactLenses, setContactLenses] = useState<ContactLens[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock clients data
  const [clients] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    {
      id: '2', 
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567891'
    }
  ]);

  // Load sample data
  useEffect(() => {
    // Sample products
    setProducts([
      {
        id: '1',
        name: 'Daily Comfort Drops',
        description: 'Gentle daily comfort eye drops',
        sku: 'DCD001',
        categoryId: '1',
        price: 15.99,
        cost: 8.99,
        stock: 50,
        minStock: 10,
        brand: 'OptiCare',
        images: [],
        attributes: {},
        isActive: true,
        storeId: storeId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Blue Light Glasses',
        description: 'Blue light blocking glasses',
        sku: 'BLG001',
        categoryId: '2',
        price: 89.99,
        cost: 45.99,
        stock: 25,
        minStock: 5,
        brand: 'TechVision',
        images: [],
        attributes: {},
        isActive: true,
        storeId: storeId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    // Sample contact lenses
    setContactLenses([
      {
        id: '1',
        name: 'Daily Comfort',
        category: 'lentilles',
        brand: 'ClearVision',
        type: 'daily',
        material: 'Silicone Hydrogel',
        diameter: 14.2,
        baseCurve: 8.5,
        power: '0.00',
        stock: 100,
        minStock: 20,
        price: 35.99,
        cost: 18.99,
        images: [],
        isActive: true,
        storeId: storeId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    // Sample sales
    setSales([
      {
        id: '1',
        saleNumber: 'SALE-001',
        clientName: 'John Smith',
        clientEmail: 'john@example.com',
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Daily Comfort Drops',
            productType: 'product',
            quantity: 2,
            unitPrice: 15.99,
            totalPrice: 31.98
          }
        ],
        subtotal: 31.98,
        tax: 5.12,
        discount: 0,
        total: 37.10,
        amountPaid: 37.10,
        remainingBalance: 0,
        payments: [
          {
            id: '1',
            amount: 37.10,
            method: 'card',
            date: new Date(),
            notes: 'Initial payment'
          }
        ],
        status: 'completed',
        createdAt: new Date(),
        createdBy: user?.id || '',
        storeId: storeId || ''
      }
    ]);
  }, [storeId, user]);

  const generateSaleNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `SALE-${timestamp}`;
  };

  const handleCreateSale = (formData: SaleFormData) => {
    const saleItems = formData.items.map((item, index) => ({
      ...item,
      id: `item-${index}`,
      totalPrice: item.quantity * item.unitPrice
    }));

    const subtotal = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = (subtotal * formData.discount) / 100;
    const taxRate = 0.16;
    const taxAmount = (subtotal - discountAmount) * taxRate;
    const total = subtotal - discountAmount + taxAmount;
    
    const initialPayment = formData.initialPayment || 0;
    const remainingBalance = total - initialPayment;
    const status = remainingBalance > 0 ? 'partial' : 'completed';

    const payments: PaymentRecord[] = initialPayment > 0 ? [{
      id: '1',
      amount: initialPayment,
      method: formData.paymentMethod,
      date: new Date(),
      notes: 'Initial payment'
    }] : [];

    const newSale: Sale = {
      id: Date.now().toString(),
      saleNumber: generateSaleNumber(),
      clientId: formData.clientId,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      items: saleItems,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      amountPaid: initialPayment,
      remainingBalance,
      payments,
      status,
      notes: formData.notes,
      createdAt: new Date(),
      createdBy: user?.id || '',
      storeId: storeId || ''
    };

    // Update inventory
    saleItems.forEach(saleItem => {
      if (saleItem.productType === 'product') {
        setProducts(prev => prev.map(product => 
          product.id === saleItem.productId 
            ? { ...product, stock: product.stock - saleItem.quantity }
            : product
        ));
      } else {
        setContactLenses(prev => prev.map(lens => 
          lens.id === saleItem.productId 
            ? { ...lens, stock: lens.stock - saleItem.quantity }
            : lens
        ));
      }
    });

    if (isEditMode && selectedSale) {
      setSales(sales.map(sale => sale.id === selectedSale.id ? newSale : sale));
      toast.success('Sale updated successfully!');
    } else {
      setSales([newSale, ...sales]);
      toast.success('Sale completed successfully!');
    }

    setIsCreateModalOpen(false);
    setIsEditMode(false);
    setSelectedSale(null);
  };

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setSelectedSale(sale);
    setIsEditMode(true);
    setIsCreateModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleDeleteSale = (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale || sale.status !== 'refunded') {
      toast.error('Only refunded sales can be deleted');
      return;
    }

    // Restore inventory
    sale.items.forEach(saleItem => {
      if (saleItem.productType === 'product') {
        setProducts(prev => prev.map(product => 
          product.id === saleItem.productId 
            ? { ...product, stock: product.stock + saleItem.quantity }
            : product
        ));
      } else {
        setContactLenses(prev => prev.map(lens => 
          lens.id === saleItem.productId 
            ? { ...lens, stock: lens.stock + saleItem.quantity }
            : lens
        ));
      }
    });
    
    setSales(sales.filter(sale => sale.id !== saleId));
    toast.success('Sale deleted successfully');
  };

  const handleRefundSale = (saleId: string) => {
    setSales(sales.map(sale => 
      sale.id === saleId 
        ? { ...sale, status: 'refunded' as const }
        : sale
    ));
    toast.success('Sale refunded successfully');
  };

  const handleAddPayment = (sale: Sale) => {
    setSelectedSale(sale);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (saleId: string, payment: Omit<PaymentRecord, 'id' | 'date'>) => {
    setSales(prev => prev.map(sale => {
      if (sale.id === saleId) {
        const newPayment: PaymentRecord = {
          ...payment,
          id: Date.now().toString(),
          date: new Date()
        };
        
        const newAmountPaid = sale.amountPaid + payment.amount;
        const newRemainingBalance = sale.total - newAmountPaid;
        const newStatus = newRemainingBalance <= 0 ? 'completed' : 'partial';
        
        return {
          ...sale,
          amountPaid: newAmountPaid,
          remainingBalance: Math.max(0, newRemainingBalance),
          payments: [...sale.payments, newPayment],
          status: newStatus
        };
      }
      return sale;
    }));
    
    toast.success('Payment added successfully!');
  };

  const handlePrintReceipt = (sale: Sale) => {
    toast.info(`Printing receipt for ${sale.saleNumber}`);
  };

  const filteredSales = sales.filter(sale =>
    sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => 
    sale.status === 'completed' ? sum + sale.total : sum, 0
  );
  const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.createdAt);
    return saleDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Sales</h1>
          <p className="text-muted-foreground mt-1">
            Create new sales and manage transactions for this store
          </p>
        </div>
        
        <Button 
          variant="default"
          className="flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Sale
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sale Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgSaleValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySales}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search sales..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      <SalesTable
        sales={filteredSales}
        onViewSale={handleViewSale}
        onRefundSale={handleRefundSale}
        onPrintReceipt={handlePrintReceipt}
        onDeleteSale={handleDeleteSale}
        onAddPayment={handleAddPayment}
      />

      <SaleFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditMode(false);
          setSelectedSale(null);
        }}
        onSubmit={handleCreateSale}
        products={products}
        contactLenses={contactLenses}
        clients={clients}
        isEditMode={isEditMode}
        editSale={selectedSale}
      />

      <SaleViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSale(null);
        }}
        sale={selectedSale}
        onEdit={handleEditSale}
        onPrint={handlePrintReceipt}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedSale(null);
        }}
        sale={selectedSale}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
};