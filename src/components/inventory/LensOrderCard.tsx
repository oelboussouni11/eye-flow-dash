import React from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LensOrder } from '@/types/inventory';
import { useAuth } from '@/contexts/AuthContext';

interface LensOrderCardProps {
  order: LensOrder;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export const LensOrderCard: React.FC<LensOrderCardProps> = ({
  order,
  onEdit,
  onDelete,
  onView
}) => {
  const { user } = useAuth();
  
  const canManageInventory = user?.role === 'owner' || 
    user?.permissions?.inventory?.includes('manage') ||
    user?.permissions?.inventory?.includes('edit');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary' as const;
      case 'in_progress': return 'outline' as const;
      case 'ready': return 'default' as const;
      case 'delivered': return 'default' as const;
      case 'cancelled': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'in_progress': return 60;
      case 'ready': return 90;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'in_progress': return <Clock className="w-3 h-3" />;
      case 'ready': return <CheckCircle className="w-3 h-3" />;
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onView}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{order.clientName}</h3>
            <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(order.status)} className="text-xs">
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
            </Badge>
            
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
                    onView();
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Status
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{getProgressValue(order.status)}%</span>
          </div>
          
          <Progress value={getProgressValue(order.status)} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prescription</span>
            <span className="font-medium">{order.prescription}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expected Date</span>
            <span className="font-medium">
              {new Date(order.expectedDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};