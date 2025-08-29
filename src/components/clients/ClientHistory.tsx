import React from 'react';
import { Calendar, DollarSign, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClientHistory as ClientHistoryType } from '@/types/client';

interface ClientHistoryProps {
  history: ClientHistoryType[];
  clientId: string;
}

export const ClientHistory: React.FC<ClientHistoryProps> = ({
  history,
  clientId
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getHistoryTypeColor = (type: string) => {
    switch (type) {
      case 'visit':
        return 'default';
      case 'purchase':
        return 'success';
      case 'follow_up':
        return 'secondary';
      case 'complaint':
        return 'destructive';
      case 'prescription':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return Calendar;
      case 'purchase':
        return DollarSign;
      case 'follow_up':
        return User;
      case 'complaint':
        return Activity;
      case 'prescription':
        return Activity;
      default:
        return Activity;
    }
  };

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No History</h3>
          <p className="text-muted-foreground">
            History will be automatically added when the client makes purchases or visits
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Client History</h3>
        <span className="text-sm text-muted-foreground">
          Auto-generated from system activities
        </span>
      </div>

      <div className="space-y-4">
        {sortedHistory.map((entry) => {
          const Icon = getHistoryIcon(entry.type);
          
          return (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <Badge variant={getHistoryTypeColor(entry.type)}>
                            {entry.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(entry.date)}
                          </span>
                          {entry.amount && (
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrency(entry.amount)}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm">{entry.description}</p>
                        
                        {entry.employeeName && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            Handled by {entry.employeeName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};