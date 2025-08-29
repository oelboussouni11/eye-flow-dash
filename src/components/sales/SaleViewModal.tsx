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
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${sale.saleNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .details div { flex: 1; }
          .items table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items th { background-color: #f2f2f2; }
          .summary { margin-left: auto; width: 300px; }
          .summary table { width: 100%; }
          .summary td { padding: 5px; }
          .total { font-weight: bold; font-size: 1.2em; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <h2>${sale.saleNumber}</h2>
        </div>
        
        <div class="details">
          <div>
            <strong>Bill To:</strong><br>
            ${sale.clientName || 'Walk-in Customer'}<br>
            ${sale.clientEmail || ''}
          </div>
          <div style="text-align: right;">
            <strong>Date:</strong> ${new Date(sale.createdAt).toLocaleDateString()}<br>
            <strong>Payment Method:</strong> ${sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}<br>
            <strong>Status:</strong> ${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
          </div>
        </div>

        <div class="items">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.totalPrice.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="summary">
          <table>
            <tr><td>Subtotal:</td><td>$${sale.subtotal.toFixed(2)}</td></tr>
            <tr><td>Discount:</td><td>-$${sale.discount.toFixed(2)}</td></tr>
            <tr><td>Tax:</td><td>$${sale.tax.toFixed(2)}</td></tr>
            <tr class="total"><td>Total:</td><td>$${sale.total.toFixed(2)}</td></tr>
          </table>
        </div>

        ${sale.notes ? `<div style="margin-top: 30px;"><strong>Notes:</strong><br>${sale.notes}</div>` : ''}
        
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
                <p><strong>Payment Method:</strong> {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}</p>
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
                  <span>Tax:</span>
                  <span>${sale.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${sale.total.toFixed(2)}</span>
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