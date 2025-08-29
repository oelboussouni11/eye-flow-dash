import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sale } from '@/types/sales';

interface SaleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  onEdit: (sale: Sale) => void;
  onPrint: (sale: Sale) => void;
}

export const SaleViewModal: React.FC<SaleViewModalProps> = ({
  isOpen,
  onClose,
  sale,
  onEdit,
  onPrint
}) => {
  if (!sale) return null;

  const handlePrint = () => {
    // Get store configuration
    const storeConfig = localStorage.getItem(`store-${sale.storeId}-config`);
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
          .payment-section { margin-top: 30px; }
          .payment-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .status-completed { background: #dcfce7; color: #166534; }
          .status-partial { background: #fef3c7; color: #92400e; }
          .status-pending { background: #fee2e2; color: #dc2626; }
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
              <tr><td>Tax (${(sale.tax / (sale.subtotal - sale.discount) * 100).toFixed(1)}%):</td><td style="text-align: right;">$${sale.tax.toFixed(2)}</td></tr>
              <tr class="total-row"><td>Total:</td><td style="text-align: right;">$${sale.total.toFixed(2)}</td></tr>
              <tr><td>Amount Paid:</td><td style="text-align: right;">$${sale.paidAmount.toFixed(2)}</td></tr>
              <tr><td style="font-weight: bold;">Balance Due:</td><td style="text-align: right; font-weight: bold;">$${sale.remainingAmount.toFixed(2)}</td></tr>
            </table>
          </div>

          ${sale.payments && sale.payments.length > 0 ? `
            <div class="payment-section">
              <h3>Payment History:</h3>
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
            For questions about this invoice, please contact us at info@optivision.com
          </div>
        </div>
        
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Sale Details - {sale.saleNumber}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(sale)}>
                Edit Sale
              </Button>
              <Button onClick={handlePrint}>
                Print Invoice
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sale Info */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {sale.clientName || 'Walk-in Customer'}</p>
                {sale.clientEmail && <p><strong>Email:</strong> {sale.clientEmail}</p>}
                <p><strong>Sale Date:</strong> {new Date(sale.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> {sale.payments[0]?.method.charAt(0).toUpperCase() + sale.payments[0]?.method.slice(1) || 'N/A'}</p>
                <p><strong>Status:</strong> {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sale Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${sale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${sale.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({(sale.tax / (sale.subtotal - sale.discount) * 100).toFixed(1)}%):</span>
                  <span>${sale.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${sale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>${sale.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-red-600">
                  <span>Remaining:</span>
                  <span>${sale.remainingAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sale.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.productType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                      <p className="text-sm font-bold">${item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {sale.payments && sale.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sale.payments.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</p>
                      </div>
                      <p className="font-bold">${payment.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {sale.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{sale.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};