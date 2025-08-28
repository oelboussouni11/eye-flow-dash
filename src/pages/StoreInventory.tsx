import React from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Filter, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const StoreInventory: React.FC = () => {
  const { storeId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage products and stock levels for this store
          </p>
        </div>
        
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search inventory..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-card p-6 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lunettes</h3>
              <p className="text-sm text-muted-foreground">Eyewear frames</p>
            </div>
          </div>
          <div className="mt-4 text-2xl font-bold text-primary">0</div>
        </div>

        <div className="bg-gradient-card p-6 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Accessoires</h3>
              <p className="text-sm text-muted-foreground">Accessories</p>
            </div>
          </div>
          <div className="mt-4 text-2xl font-bold text-accent">0</div>
        </div>

        <div className="bg-gradient-card p-6 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Verres</h3>
              <p className="text-sm text-muted-foreground">Lenses (order-only)</p>
            </div>
          </div>
          <div className="mt-4 text-2xl font-bold text-warning">0</div>
        </div>
      </div>

      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No products yet</h3>
        <p className="text-muted-foreground mb-4">
          Add your first product to start managing store inventory
        </p>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add First Product
        </Button>
      </div>
    </div>
  );
};