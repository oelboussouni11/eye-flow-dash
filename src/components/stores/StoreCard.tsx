import React from 'react';
import { MapPin, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Store {
  id: string;
  name: string;
  address: string;
  image?: string;
  info?: string;
  ownerId: string;
  employeeCount?: number;
  createdAt: string;
}

interface StoreCardProps {
  store: Store;
  onEdit?: (store: Store) => void;
  onDelete?: (id: string) => void;
  onView: (store: Store) => void;
  canEdit?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onEdit,
  onDelete,
  onView,
  canEdit = true
}) => {
  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {store.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {store.address}
            </div>
          </div>
          {store.employeeCount !== undefined && (
            <Badge variant="secondary" className="ml-2">
              {store.employeeCount} employees
            </Badge>
          )}
        </div>
      </CardHeader>

      {store.image && (
        <div className="px-6">
          <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
            <img 
              src={store.image} 
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <CardContent className="pt-4">
        {store.info && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {store.info}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">          
          {canEdit && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(store)}
              className="flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </Button>
          )}
          
          {canEdit && onDelete && (
            <Button
              variant="delete"
              size="sm"
              onClick={() => onDelete(store.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(store)}
          className="flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          Enter Store
        </Button>
      </CardFooter>
    </Card>
  );
};