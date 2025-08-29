import React, { useState } from 'react';
import { Plus, Minus, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Sale, SaleFormData, PaymentRecord, SaleItem } from '@/types/sales';
import { useTax } from '@/contexts/TaxContext';
import { useParams } from 'react-router-dom';
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
  const { storeId } = useParams();
  
  // Get store-specific tax rate, fallback to global tax rate
  const getStoreTaxRate = () => {
    const storeConfig = localStorage.getItem(`store-${storeId}-config`);
    if (storeConfig) {
      const config = JSON.parse(storeConfig);
      return config.taxRate || 16;
    }
    return 16; // Default fallback
  };
  
  const storeTaxRate = getStoreTaxRate();
  
  const [formData, setFormData] = useState<SaleFormData>({
    items: [],
    discount: 0,
    paymentMethod: 'cash',
    initialPayment: 0,
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
        paymentMethod: editSale.payments[0]?.method || 'cash',
        initialPayment: editSale.paidAmount,
        notes: editSale.notes || ''
      });
      
      const client = clients.find(c => c.id === editSale.clientId);
      if (client) setSelectedClient(client);
    } else {
      setFormData({
        items: [],
        discount: 0,
        paymentMethod: 'cash',
        initialPayment: 0,
        notes: ''
      });
      setSelectedClient(null);
    }
  }, [isEditMode, editSale, clients]);

  const addItem = (product: Product | ContactLens, type: 'product' | 'contact_lens') => {
    const newItem: Omit<SaleItem, 'id' | 'totalPrice'> = {
      productId: product.id,
      productName: product.name || (product as any).brand,
      productType: type,
      quantity: 1,
      unitPrice: product.price
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], quantity };
    setFormData({ ...formData, items: newItems });
  };

  const updateItemPrice = (index: number, unitPrice: number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], unitPrice };
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Calculate totals using the store-specific tax rate
  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = (subtotal * formData.discount) / 100;
  const taxAmount = (subtotal - discountAmount) * (storeTaxRate / 100);
  const total = subtotal - discountAmount + taxAmount;
  const remainingBalance = total - (formData.initialPayment || 0);

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
      initialPayment: 0,
      notes: ''
    });
    setSelectedClient(null);
    onClose();
  };

  const filteredProducts = [...products, ...contactLenses].filter(item =>
    (item.name || (item as any).brand).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Sale' : 'Create New Sale'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Customer Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientSearch">Search Existing Customers</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="clientSearch"
                    placeholder="Search by name or email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {searchTerm && filteredClients.length > 0 && (
                  <div className="border rounded-md max-h-32 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <button
                        key={client.id}
                        className="w-full text-left p-2 hover:bg-muted border-b last:border-b-0"
                        onClick={() => {
                          setSelectedClient(client);
                          setSearchTerm('');
                        }}
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Manual Customer Entry */}
              <div className="space-y-2">
                <Label>Or Enter Customer Details</Label>
                <Input
                  placeholder="Customer name"
                  value={selectedClient?.name || formData.clientName || ''}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  disabled={!!selectedClient}
                />
                <Input
                  placeholder="Customer email"
                  value={selectedClient?.email || formData.clientEmail || ''}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  disabled={!!selectedClient}
                />
                {selectedClient && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedClient(null)}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Add Items to Sale</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {searchTerm && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto border rounded-lg p-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-3 hover:bg-muted cursor-pointer"
                    onClick={() => {
                      const type = 'category' in product ? 'contact_lens' : 'product';
                      addItem(product, type);
                      setSearchTerm('');
                    }}
                  >
                    <div className="font-medium">{product.name || (product as any).brand}</div>
                    <div className="text-sm text-muted-foreground">${product.price.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      Stock: {product.stock} | {'category' in product ? 'Contact Lens' : 'Product'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Items */}
          {formData.items.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Sale Items</Label>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground capitalize">{item.productType}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItemPrice(index, parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                      />
                    </div>
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
                <Label htmlFor="initialPayment">Initial Payment</Label>
                <Input
                  id="initialPayment"
                  type="number"
                  step="0.01"
                  min="0"
                  max={total}
                  value={formData.initialPayment || 0}
                  onChange={(e) => setFormData({ ...formData, initialPayment: Number(e.target.value) })}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave 0 for unpaid sale or enter partial/full amount
                </p>
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
                  <span>Tax ({storeTaxRate}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                {(formData.initialPayment || 0) > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Initial Payment:</span>
                      <span>${(formData.initialPayment || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-red-600">
                      <span>Remaining Balance:</span>
                      <span>${remainingBalance.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={formData.items.length === 0}>
            {isEditMode ? 'Update Sale' : 'Create Sale'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};