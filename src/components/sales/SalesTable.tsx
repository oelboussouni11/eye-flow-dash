import React from 'react';
import { Eye, RefreshCw, Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sale } from '@/types/sales';

interface SalesTableProps {
  sales: Sale[];
  onViewSale: (sale: Sale) => void;
  onRefundSale: (saleId: string) => void;
  onPrintReceipt: (sale: Sale) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onViewSale,
  onRefundSale,
  onPrintReceipt
}) => {
  const getStatusBadge = (status: Sale['status']) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      refunded: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: Sale['paymentMethod']) => {
    const labels = {
      cash: 'Cash',
      card: 'Card',
      transfer: 'Transfer',
      cheque: 'Cheque'
    };
    return labels[method];
  };

  if (sales.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Printer className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No sales yet</h3>
          <p className="text-muted-foreground">
            Create your first sale to start generating revenue
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sale #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
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
                  <div>
                    <p className="font-medium">{sale.items.length} item(s)</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.items.slice(0, 2).map(item => item.productName).join(', ')}
                      {sale.items.length > 2 && '...'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getPaymentMethodLabel(sale.paymentMethod)}</TableCell>
                <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(sale.status)}</TableCell>
                <TableCell>
                  {new Date(sale.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewSale(sale)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPrintReceipt(sale)}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                    {sale.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRefundSale(sale.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};