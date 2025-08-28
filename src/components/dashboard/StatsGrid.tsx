import React from 'react';
import { Store, Users, Package, TrendingUp, Eye, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsGridProps {
  totalStores: number;
  totalEmployees: number;
  totalClients?: number;
  totalProducts?: number;
  monthlyRevenue?: number;
  activeStores?: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalStores,
  totalEmployees,
  totalClients = 0,
  totalProducts = 0,
  monthlyRevenue = 0,
  activeStores
}) => {
  const stats = [
    {
      title: "Total Stores",
      value: totalStores,
      icon: Store,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Active Stores",
      value: activeStores || totalStores,
      icon: Eye,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Products",
      value: totalProducts,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};