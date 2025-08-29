import React, { useState } from 'react';
import { Plus, Minus, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SaleFormData, SaleItem } from '@/types/sales';
import { Product, ContactLens } from '@/types/inventory';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface SaleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaleFormData) => void;
  products: Product[];
  contactLenses: ContactLens[];
  clients: Client[];
  isEditMode?: boolean;
  editSale?: any;
}

export const SaleFormModal: React.FC<SaleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  products,
  contactLenses,
  clients,
  isEditMode = false,
  editSale
}) => {
  const [formData, setFormData] = useState<SaleFormData>({
    items: [],
    discount: 0,
    paymentMethod: 'cash',
    notes: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Load edit data
  React.useEffect(() => {
    if (isEditMode && editSale) {
      setFormData({
        clientId: editSale.clientId,
        clientName: editSale.clientName,
        clientEmail: editSale.clientEmail,
        items: editSale.items.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          productType: item.productType,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        discount: (editSale.discount / editSale.subtotal) * 100,
        paymentMethod: editSale.paymentMethod,
        notes: editSale.notes || ''
      });
      
      const client = clients.find(c => c.id === editSale.clientId);
      if (client) setSelectedClient(client);
    } else {
      setFormData({
        items: [],
        discount: 0,
        paymentMethod: 'cash',
        notes: ''
      });
      setSelectedClient(null);
    }
  }, [isEditMode, editSale, clients]);

  const allItems = [
    ...products.map(p => ({ ...p, type: 'product' as const })),
    ...contactLenses.map(cl => ({ ...cl, type: 'contact_lens' as const }))
  ];

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (item: typeof allItems[0]) => {
    const existingIndex = formData.items.findIndex(
      saleItem => saleItem.productId === item.id && saleItem.productType === item.type
    );

    if (existingIndex >= 0) {
      const newItems = [...formData.items];
      newItems[existingIndex].quantity += 1;
      setFormData({ ...formData, items: newItems });
    } else {
      const newItem: Omit<SaleItem, 'id' | 'totalPrice'> = {
        productId: item.id,
        productName: item.name,
        productType: item.type,
        quantity: 1,
        unitPrice: item.price
      };
      setFormData({ ...formData, items: [...formData.items, newItem] });
    }
    setSearchTerm('');
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    const newItems = [...formData.items];
    newItems[index].quantity = quantity;
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = (subtotal * formData.discount) / 100;
  const taxRate = 0.16; // 16% tax
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const handleSubmit = () => {
    if (formData.items.length === 0) {
      toast.error('Please add at least one item to the sale');
      return;
    }

    onSubmit({
      ...formData,
      clientId: selectedClient?.id,
      clientName: selectedClient?.name || formData.clientName,
      clientEmail: selectedClient?.email || formData.clientEmail
    });
    setFormData({
      items: [],
      discount: 0,
      paymentMethod: 'cash',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Sale' : 'New Sale'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="clientSelect">Select Customer</Label>
                <Select
                  value={selectedClient?.id || ''}
                  onValueChange={(value) => {
                    const client = clients.find(c => c.id === value);
                    setSelectedClient(client || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select existing customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="clientName">Customer Name</Label>
                <Input
                  id="clientName"
                  value={selectedClient?.name || formData.clientName || ''}
                  onChange={(e) => {
                    if (!selectedClient) {
                      setFormData({ ...formData, clientName: e.target.value });
                    }
                  }}
                  placeholder="Enter customer name"
                  disabled={!!selectedClient}
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Customer Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={selectedClient?.email || formData.clientEmail || ''}
                  onChange={(e) => {
                    if (!selectedClient) {
                      setFormData({ ...formData, clientEmail: e.target.value });
                    }
                  }}
                  placeholder="Enter customer email"
                  disabled={!!selectedClient}
                />
              </div>
            </div>
          </div>

          {/* Add Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Items</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products and contact lenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchTerm && (
              <Card className="max-h-40 overflow-y-auto">
                <CardContent className="p-2">
                  {filteredItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => addItem(item)}
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.brand} • Stock: {item.stock} • ${item.price}
                        </p>
                      </div>
                      <Plus className="w-4 h-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sale Items */}
          {formData.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sale Items</h3>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">${item.unitPrice} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <div className="w-20 text-right font-medium">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sale Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Summary */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium">Sale Summary</h4>
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({formData.discount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (16%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? 'Update Sale' : 'Complete Sale'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};