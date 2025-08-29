import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sale, PaymentRecord } from '@/types/sales';

interface PaymentFormData {
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'cheque';
  notes?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  onSubmit: (saleId: string, payment: Omit<PaymentRecord, 'id' | 'date'>) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  sale,
  onSubmit
}) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PaymentFormData>();

  const handleFormSubmit = (data: PaymentFormData) => {
    if (!sale) return;

    const payment: Omit<PaymentRecord, 'id' | 'date'> = {
      amount: data.amount,
      method: data.method,
      notes: data.notes
    };

    onSubmit(sale.id, payment);
    reset();
    onClose();
  };

  if (!sale) return null;

  const maxPayment = sale.remainingBalance;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment - {sale.saleNumber}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Outstanding Balance</Label>
            <div className="text-2xl font-bold text-red-600">
              ${sale.remainingBalance.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              max={maxPayment}
              placeholder="0.00"
              {...register('amount', { 
                required: 'Payment amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
                max: { value: maxPayment, message: `Amount cannot exceed $${maxPayment.toFixed(2)}` }
              })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method *</Label>
            <Select onValueChange={(value) => setValue('method', value as any)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Payment notes (optional)"
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};