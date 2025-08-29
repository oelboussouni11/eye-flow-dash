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
import { useTax } from '@/contexts/TaxContext';
import { Sale, SaleFormData, PaymentRecord } from '@/types/sales';
import { Product, ContactLens, DEFAULT_CATEGORIES } from '@/types/inventory';
import { toast } from 'sonner';

export const StoreSales: React.FC = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  
  // Get store-specific tax rate
  const getStoreTaxRate = () => {
    const storeConfig = localStorage.getItem(`store-${storeId}-config`);
    if (storeConfig) {
      const config = JSON.parse(storeConfig);
      return config.taxRate || 16;
    }
    return 16; // Default fallback
  };
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
        paidAmount: 37.10,
        remainingAmount: 0,
        payments: [
          {
            id: '1',
            amount: 37.10,
            method: 'card',
            date: new Date(),
            notes: 'Full payment'
          }
        ],
        status: 'paid',
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
    const taxAmount = (subtotal - discountAmount) * (getStoreTaxRate() / 100);
    const total = subtotal - discountAmount + taxAmount;
    
    const initialPayment = formData.initialPayment || 0;
    const paidAmount = Math.min(initialPayment, total);
    const remainingAmount = total - paidAmount;
    
    // Determine status based on payment
    let status: Sale['status'];
    if (remainingAmount <= 0) {
      status = 'paid';
    } else if (paidAmount > 0) {
      status = 'partial';
    } else {
      status = 'unpaid';
    }

    const payments: PaymentRecord[] = paidAmount > 0 ? [{
      id: Date.now().toString(),
      amount: paidAmount,
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
      paidAmount,
      remainingAmount,
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
    if (!sale) {
      toast.error('Sale not found');
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
        
        const newPaidAmount = sale.paidAmount + payment.amount;
        const newRemainingAmount = sale.total - newPaidAmount;
        
        // Determine new status
        let newStatus: Sale['status'];
        if (newRemainingAmount <= 0) {
          newStatus = 'paid';
        } else if (newPaidAmount > 0) {
          newStatus = 'partial';
        } else {
          newStatus = 'unpaid';
        }
        
        return {
          ...sale,
          paidAmount: newPaidAmount,
          remainingAmount: Math.max(0, newRemainingAmount),
          payments: [...sale.payments, newPayment],
          status: newStatus
        };
      }
      return sale;
    }));
    
    toast.success('Payment added successfully!');
  };

  const handlePrintReceipt = (sale: Sale) => {
    // Get store configuration
    const storeConfig = localStorage.getItem(`store-${storeId}-config`);
    const config = storeConfig ? JSON.parse(storeConfig) : {
      storeName: 'Beom Optic Store',
      address: '123 Main Street, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@beomoptic.com',
      taxId: '123-456-789'
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${sale.saleNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #333; }
          .invoice-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 40px; }
          .store-info { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .store-details { font-size: 14px; color: #666; line-height: 1.4; }
          .invoice-title { font-size: 36px; font-weight: bold; color: #1e40af; margin: 20px 0 10px; }
          .invoice-number { font-size: 20px; color: #64748b; }
          .billing-section { display: flex; justify-content: space-between; margin: 40px 0; }
          .billing-info { flex: 1; }
          .billing-info h3 { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #374151; }
          .billing-details { font-size: 14px; line-height: 1.6; color: #666; }
          .items-section { margin: 30px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; }
          .items-table td { border: 1px solid #e2e8f0; padding: 12px 8px; }
          .items-table tbody tr:nth-child(even) { background: #f9fafb; }
          .summary-section { margin-left: auto; width: 350px; }
          .summary-table { width: 100%; }
          .summary-table td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
          .summary-table .total-row { font-weight: bold; font-size: 18px; border-top: 2px solid #374151; color: #1e40af; }
          .payment-section { margin-top: 30px; }
          .payment-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-partial { background: #fef3c7; color: #92400e; }
          .status-unpaid { background: #fee2e2; color: #dc2626; }
          .notes-section { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; }
          @media print { 
            body { margin: 0; padding: 10px; } 
            .invoice-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="store-info">${config.storeName}</div>
            <div class="store-details">
              ${config.address}<br>
              Phone: ${config.phone} | Email: ${config.email}<br>
              ${config.taxId ? `Tax ID: ${config.taxId}` : ''}
            </div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">#${sale.saleNumber}</div>
          </div>

          <div class="billing-section">
            <div class="billing-info">
              <h3>Bill To:</h3>
              <div class="billing-details">
                ${sale.clientName || 'Walk-in Customer'}<br>
                ${sale.clientEmail || ''}
              </div>
            </div>
            <div class="billing-info">
              <h3>Invoice Details:</h3>
              <div class="billing-details">
                <strong>Date:</strong> ${new Date(sale.createdAt).toLocaleDateString()}<br>
                <strong>Status:</strong> <span class="payment-status status-${sale.status}">${sale.status}</span>
              </div>
            </div>
          </div>

          <div class="items-section">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${sale.items.map(item => `
                  <tr>
                    <td>${item.productName}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                    <td style="text-align: right;">$${item.totalPrice.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary-section">
              <table class="summary-table">
                <tr>
                  <td>Subtotal:</td>
                  <td style="text-align: right;">$${sale.subtotal.toFixed(2)}</td>
                </tr>
                ${sale.discount > 0 ? `
                  <tr>
                    <td>Discount:</td>
                    <td style="text-align: right;">-$${sale.discount.toFixed(2)}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td>Tax:</td>
                  <td style="text-align: right;">$${sale.tax.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td>Total:</td>
                  <td style="text-align: right;">$${sale.total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Paid:</td>
                  <td style="text-align: right;">$${sale.paidAmount.toFixed(2)}</td>
                </tr>
                ${sale.remainingAmount > 0 ? `
                  <tr>
                    <td>Balance Due:</td>
                    <td style="text-align: right; color: #dc2626; font-weight: bold;">$${sale.remainingAmount.toFixed(2)}</td>
                  </tr>
                ` : ''}
              </table>
            </div>
          </div>

          ${sale.payments && sale.payments.length > 0 ? `
            <div class="payment-section">
              <h3>Payment History</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Method</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${sale.payments.map(payment => `
                    <tr>
                      <td>${new Date(payment.date).toLocaleDateString()}</td>
                      <td>${payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</td>
                      <td style="text-align: right;">$${payment.amount.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${sale.notes ? `
            <div class="notes-section">
              <strong>Notes:</strong><br>
              ${sale.notes}
            </div>
          ` : ''}
          
          <div class="footer">
            Thank you for your business!<br>
            For questions about this invoice, please contact us at ${config.email}
          </div>
        </div>
        
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    toast.success('Invoice sent to printer');
  };

  const filteredSales = sales.filter(sale =>
    sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);
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