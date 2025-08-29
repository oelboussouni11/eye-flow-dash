import React from 'react';
import { MoreHorizontal, Edit, Trash2, Package, Glasses, Eye, Sun, SprayCan, ShoppingBag, Wrench, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/inventory';

interface CategoryCardProps {
  category: Category;
  productCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const getIconComponent = (iconName: string) => {
  const icons = {
    'package': Package,
    'glasses': Glasses,
    'eye': Eye,
    'sun': Sun,
    'spray-can': SprayCan,
    'shopping-bag': ShoppingBag,
    'wrench': Wrench,
    'heart': Heart,
  };
  return icons[iconName as keyof typeof icons] || Package;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productCount,
  onEdit,
  onDelete,
  onClick
}) => {
  const IconComponent = getIconComponent(category.icon);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category.color.replace('hsl(var(--', 'hsl(var(--').replace('))', ') / 0.2)') }}
            >
              <IconComponent 
                className="w-5 h-5" 
                style={{ color: category.color }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          </div>
          
          {!category.isDefault && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold" style={{ color: category.color }}>
            {productCount}
          </div>
          {category.isDefault && (
            <Badge variant="secondary" className="text-xs">
              Default
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};