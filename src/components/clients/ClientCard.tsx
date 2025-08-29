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
    <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <Calendar className="w-4 h-4 text-white bg-primary rounded p-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground text-xs block">Born</span>
                <span className="font-medium text-xs truncate block">{formatDate(client.dateOfBirth)}</span>
              </div>
            </div>
            {client.lastVisit && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <User className="w-4 h-4 text-white bg-secondary rounded p-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-muted-foreground text-xs block">Last visit</span>
                  <span className="font-medium text-xs truncate block">{formatDate(client.lastVisit)}</span>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <DollarSign className="w-4 h-4 text-white bg-green-600 rounded p-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground text-xs block">Total spent</span>
                <span className="font-medium text-xs truncate block">{formatCurrency(client.totalSpent)}</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30">
              <span className="text-muted-foreground text-xs block">Prescriptions</span>
              <span className="font-medium text-xs">
                {client.prescriptionHistory.length} prescription{client.prescriptionHistory.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {client.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                {tag}
              </Badge>
            ))}
            {client.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/50">
                +{client.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground line-clamp-2 bg-muted/20 p-2 rounded-lg">
          <span className="text-xs text-muted-foreground block mb-1">Address</span>
          {client.address.street}, {client.address.city}, {client.address.state}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 bg-muted/20 -mb-6 -mx-6 mt-4 px-6 pb-6">
        <div className="flex items-center gap-2">
          {canEdit && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(client)}
              className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
            >
              <Edit className="w-3 h-3" />
              Edit
            </Button>
          )}
          
          {canEdit && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(client.id)}
              className="flex items-center gap-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
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
          className="flex items-center gap-1 bg-primary/10 text-primary border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Eye className="w-3 h-3" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};