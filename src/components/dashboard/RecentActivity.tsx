import React from 'react';
import { Clock, Store, Users, Package, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  type: 'store' | 'employee' | 'client' | 'inventory' | 'invoice';
  action: string;
  description: string;
  timestamp: string;
  user: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'store': return Store;
      case 'employee': return Users;
      case 'client': return Users;
      case 'inventory': return Package;
      case 'invoice': return FileText;
      default: return Clock;
    }
  };

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'store': return 'text-primary';
      case 'employee': return 'text-accent';
      case 'client': return 'text-warning';
      case 'inventory': return 'text-success';
      case 'invoice': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  // Sample activities if none provided
  const sampleActivities: Activity[] = [
    {
      id: '1',
      type: 'store',
      action: 'Created',
      description: 'New store "Downtown Vision" created',
      timestamp: '2 hours ago',
      user: 'John Doe'
    },
    {
      id: '2',
      type: 'employee',
      action: 'Added',
      description: 'Employee "Sarah Smith" added to Main Street store',
      timestamp: '4 hours ago',
      user: 'John Doe'
    },
    {
      id: '3',
      type: 'inventory',
      action: 'Updated',
      description: 'Stock updated for Ray-Ban Aviators',
      timestamp: '6 hours ago',
      user: 'Mike Johnson'
    },
    {
      id: '4',
      type: 'client',
      action: 'Created',
      description: 'New client profile for Emma Wilson',
      timestamp: '1 day ago',
      user: 'Sarah Smith'
    },
    {
      id: '5',
      type: 'invoice',
      action: 'Generated',
      description: 'Invoice #INV-001 generated for $250.00',
      timestamp: '1 day ago',
      user: 'Mike Johnson'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : sampleActivities;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Clock className="w-5 h-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayActivities.slice(0, 5).map((activity) => {
          const Icon = getIcon(activity.type);
          const color = getColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {activity.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-sm text-foreground font-medium">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  by {activity.user}
                </p>
              </div>
            </div>
          );
        })}
        
        {displayActivities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};