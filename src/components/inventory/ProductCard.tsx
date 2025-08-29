import React from 'react';
import { MoreHorizontal, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types/inventory';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onClick
}) => {
  const { user } = useAuth();
  
  const canManageInventory = user?.role === 'owner' || 
    user?.permissions?.inventory?.includes('manage') ||
    user?.permissions?.inventory?.includes('edit');

  const getStockStatus = () => {
    if (product.stock <= 0) return { status: 'out', color: 'destructive' as const };
    if (product.stock <= product.minStock) return { status: 'low', color: 'secondary' as const };
    return { status: 'good', color: 'default' as const };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              {product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.sku}</p>
            </div>
          </div>
          
          {canManageInventory && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-semibold">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stock</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{product.stock}</span>
              <Badge variant={stockStatus.color} className="text-xs">
                {stockStatus.status === 'out' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {stockStatus.status === 'out' ? 'Out of Stock' : 
                 stockStatus.status === 'low' ? 'Low Stock' : 'In Stock'}
              </Badge>
            </div>
          </div>
          
          {product.brand && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Brand</span>
              <span className="text-sm">{product.brand}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};