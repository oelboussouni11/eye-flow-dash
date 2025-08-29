import React from 'react';
import { Phone, Mail, Calendar, Edit, Trash2, Eye, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Client } from '@/types/client';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (id: string) => void;
  onView: (client: Client) => void;
  canEdit?: boolean;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  onDelete,
  onView,
  canEdit = true
}) => {
  const fullName = `${client.firstName} ${client.lastName}`;
  const initials = `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {fullName}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {client.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {client.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={client.status === 'active' ? 'success' : 'secondary'}
              className="capitalize"
            >
              {client.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Born:</span>
              <span className="font-medium">{formatDate(client.dateOfBirth)}</span>
            </div>
            {client.lastVisit && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last visit:</span>
                <span className="font-medium">{formatDate(client.lastVisit)}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total spent:</span>
              <span className="font-medium">{formatCurrency(client.totalSpent)}</span>
            </div>
            <div className="text-muted-foreground">
              {client.prescriptionHistory.length} prescription{client.prescriptionHistory.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {client.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {client.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{client.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground line-clamp-2">
          {client.address.street}, {client.address.city}, {client.address.state}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {canEdit && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(client)}
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
              onClick={() => onDelete(client.id)}
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
          onClick={() => onView(client)}
          className="flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};