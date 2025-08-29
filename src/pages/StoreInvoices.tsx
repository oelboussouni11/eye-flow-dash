import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, FileText, DollarSign, Calendar, Users, Eye, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SaleViewModal } from '@/components/sales/SaleViewModal';
import { SaleFormModal } from '@/components/sales/SaleFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { Sale, SaleFormData } from '@/types/sales';
import { Product, ContactLens } from '@/types/inventory';
import { toast } from 'sonner';

export const StoreInvoices: React.FC = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [contactLenses, setContactLenses] = useState<ContactLens[]>([]);
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
    // Load products for editing
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

    // Load contact lenses for editing
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
    // Sample invoices data
    setSales([
      {
        id: '1',
        saleNumber: 'INV-001',
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
        createdAt: new Date('2024-01-15'),
        createdBy: user?.id || '',
        storeId: storeId || ''
      },
      {
        id: '2',
        saleNumber: 'INV-002',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah@example.com',
        items: [
          {
            id: '1',
            productId: '2',
            productName: 'Blue Light Glasses',
            productType: 'product',
            quantity: 1,
            unitPrice: 89.99,
            totalPrice: 89.99
          }
        ],
        subtotal: 89.99,
        tax: 14.40,
        discount: 5.00,
        total: 99.39,
        paidAmount: 50.00,
        remainingAmount: 49.39,
        payments: [
          {
            id: '1',
            amount: 50.00,
            method: 'cash',
            date: new Date(),
            notes: 'Partial payment'
          }
        ],
        status: 'partial',
        createdAt: new Date('2024-01-20'),
        createdBy: user?.id || '',
        storeId: storeId || ''
      },
      {
        id: '3',
        saleNumber: 'INV-003',
        clientName: 'Mike Wilson',
        clientEmail: 'mike@example.com',
        items: [
          {
            id: '1',
            productId: '3',
            productName: 'Contact Lens Solution',
            productType: 'product',
            quantity: 3,
            unitPrice: 12.50,
            totalPrice: 37.50
          }
        ],
        subtotal: 37.50,
        tax: 6.00,
        discount: 0,
        total: 43.50,
        paidAmount: 0,
        remainingAmount: 43.50,
        payments: [],
        status: 'unpaid',
        createdAt: new Date('2024-01-25'),
        createdBy: user?.id || '',
        storeId: storeId || ''
      }
    ]);
  }, [storeId, user]);

  const handleViewInvoice = (sale: Sale) => {
    setSelectedSale(sale);
    setIsViewModalOpen(true);
  };

  const handleEditInvoice = (sale: Sale) => {
    setSelectedSale(sale);
    setIsEditMode(true);
    setIsFormModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handlePrintInvoice = (sale: Sale) => {
    // Get store configuration
    const storeConfig = localStorage.getItem(`store-${storeId}-config`);
    const config = storeConfig ? JSON.parse(storeConfig) : {
      storeName: 'OptiVision Store',
      address: '123 Main Street, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@optivision.com',
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
          .payment-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-partial { background: #fef3c7; color: #92400e; }
          .status-unpaid { background: #fee2e2; color: #dc2626; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; }
          @media print { body { margin: 0; padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            ${config.logo ? `<img src="${config.logo}" alt="${config.storeName}" style="max-height: 80px; margin: 0 auto 20px;" />` : ''}
            <div class="store-info">${config.storeName}</div>
            <div class="store-details">
              ${config.address}<br>
              Phone: ${config.phone} | Email: ${config.email}<br>
              Tax ID: ${config.taxId}
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
            <div class="billing-info" style="text-align: right;">
              <h3>Invoice Details:</h3>
              <div class="billing-details">
                <strong>Date:</strong> ${new Date(sale.createdAt).toLocaleDateString()}<br>
                <strong>Due Date:</strong> ${new Date(sale.createdAt).toLocaleDateString()}<br>
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
                    <td>
                      <strong>${item.productName}</strong><br>
                      <small style="color: #666;">${item.productType === 'contact_lens' ? 'Contact Lens' : 'Product'}</small>
                    </td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                    <td style="text-align: right;">$${item.totalPrice.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="summary-section">
            <table class="summary-table">
              <tr><td>Subtotal:</td><td style="text-align: right;">$${sale.subtotal.toFixed(2)}</td></tr>
              <tr><td>Discount:</td><td style="text-align: right;">-$${sale.discount.toFixed(2)}</td></tr>
              <tr><td>Tax:</td><td style="text-align: right;">$${sale.tax.toFixed(2)}</td></tr>
              <tr class="total-row"><td>Total:</td><td style="text-align: right;">$${sale.total.toFixed(2)}</td></tr>
              <tr><td>Amount Paid:</td><td style="text-align: right;">$${sale.paidAmount.toFixed(2)}</td></tr>
              <tr><td style="font-weight: bold;">Balance Due:</td><td style="text-align: right; font-weight: bold;">$${sale.remainingAmount.toFixed(2)}</td></tr>
            </table>
          </div>

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
  };

  // Filter sales based on search and filters
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const saleDate = new Date(sale.createdAt);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return saleDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return saleDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return saleDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate stats
  const totalInvoices = filteredSales.length;
  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const paidAmount = filteredSales.reduce((sum, sale) => sum + sale.paidAmount, 0);
  const unpaidAmount = filteredSales.reduce((sum, sale) => sum + sale.remainingAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all invoices for this store
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${unpaidAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search invoices..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No invoices found</h3>
              <p className="text-muted-foreground">
                {sales.length === 0 ? 'No invoices have been created yet' : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.saleNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sale.clientName || 'Walk-in Customer'}</p>
                        {sale.clientEmail && (
                          <p className="text-sm text-muted-foreground">{sale.clientEmail}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                    <TableCell>${sale.paidAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={sale.remainingAmount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        ${sale.remainingAmount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          sale.status === 'paid' ? 'default' : 
                          sale.status === 'partial' ? 'secondary' :
                          'outline'
                        }
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(sale)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintInvoice(sale)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Invoice Modal */}
      <SaleViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSale(null);
        }}
        sale={selectedSale}
        onEdit={handleEditInvoice}
        onPrint={handlePrintInvoice}
      />

      {/* Edit Sale Modal */}
      <SaleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setIsEditMode(false);
          setSelectedSale(null);
        }}
        onSubmit={(formData: SaleFormData) => {
          // Update sale logic here
          const updatedSale = selectedSale ? {
            ...selectedSale,
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            notes: formData.notes,
            // Update other fields as needed
          } : null;
          
          if (updatedSale) {
            setSales(prev => prev.map(sale => 
              sale.id === updatedSale.id ? updatedSale : sale
            ));
            toast.success('Invoice updated successfully!');
          }
          
          setIsFormModalOpen(false);
          setIsEditMode(false);
          setSelectedSale(null);
        }}
        products={products}
        contactLenses={contactLenses}
        clients={clients}
        isEditMode={isEditMode}
        editSale={selectedSale}
      />
    </div>
  );
};