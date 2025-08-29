import React from 'react';
import { Eye, RefreshCw, Printer, Edit, Trash2, CreditCard } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sale } from '@/types/sales';

interface SalesTableProps {
  sales: Sale[];
  onViewSale: (sale: Sale) => void;
  onRefundSale: (saleId: string) => void;
  onPrintReceipt: (sale: Sale) => void;
  onDeleteSale: (saleId: string) => void;
  onAddPayment: (sale: Sale) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onViewSale,
  onRefundSale,
  onPrintReceipt,
  onDeleteSale,
  onAddPayment
}) => {


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
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Balance</TableHead>
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
                <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                <TableCell>${sale.amountPaid.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={sale.remainingBalance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                    ${sale.remainingBalance.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      sale.status === 'completed' ? 'default' : 
                      sale.status === 'partial' ? 'secondary' :
                      sale.status === 'pending' ? 'outline' : 
                      'destructive'
                    }
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
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
                    {sale.remainingBalance > 0 && sale.status !== 'refunded' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddPayment(sale)}
                      >
                        <CreditCard className="w-4 h-4" />
                      </Button>
                    )}
                    {sale.status !== 'refunded' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRefundSale(sale.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={sale.status !== 'refunded'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Sale</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this sale? This action cannot be undone and will restore the inventory.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteSale(sale.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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