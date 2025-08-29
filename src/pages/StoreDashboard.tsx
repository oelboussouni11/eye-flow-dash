import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, Users, Package, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { StoreConfiguration } from '@/components/store/StoreConfiguration';

export const StoreDashboard: React.FC = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeId) {
      const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
      const foundStore = allStores.find((s: any) => s.id === storeId);
      setStore(foundStore);
      setLoading(false);
    }
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading store dashboard...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Store Not Found</h2>
        <p className="text-muted-foreground">The requested store could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{store.name} Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Store performance and analytics for {store.address}
        </p>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">$1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">45</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products in Stock
            </CardTitle>
            <Package className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">127</div>
            <p className="text-xs text-muted-foreground">
              5 low stock items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders Today
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">12</div>
            <p className="text-xs text-muted-foreground">
              +4 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Store Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Store Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">New client registration</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Inventory updated</p>
                  <p className="text-xs text-muted-foreground">Ray-Ban Aviators restocked - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Invoice generated</p>
                  <p className="text-xs text-muted-foreground">INV-2024-001 for $350.00 - 6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border border-border hover:bg-background/50 cursor-pointer transition-colors">
                <Users className="w-6 h-6 text-primary mb-2" />
                <p className="text-sm font-medium">New Client</p>
                <p className="text-xs text-muted-foreground">Add new customer</p>
              </div>
              <div className="p-4 rounded-lg border border-border hover:bg-background/50 cursor-pointer transition-colors">
                <Package className="w-6 h-6 text-accent mb-2" />
                <p className="text-sm font-medium">Add Product</p>
                <p className="text-xs text-muted-foreground">Update inventory</p>
              </div>
              <div className="p-4 rounded-lg border border-border hover:bg-background/50 cursor-pointer transition-colors">
                <DollarSign className="w-6 h-6 text-success mb-2" />
                <p className="text-sm font-medium">New Sale</p>
                <p className="text-xs text-muted-foreground">Create invoice</p>
              </div>
              <div className="p-4 rounded-lg border border-border hover:bg-background/50 cursor-pointer transition-colors">
                <TrendingUp className="w-6 h-6 text-warning mb-2" />
                <p className="text-sm font-medium">Reports</p>
                <p className="text-xs text-muted-foreground">View analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Configuration and Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StoreConfiguration />
        
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Store Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {store.name}</p>
                  <p><span className="text-muted-foreground">Address:</span> {store.address}</p>
                  <p><span className="text-muted-foreground">Employees:</span> {store.employeeCount || 0}</p>
                  <p><span className="text-muted-foreground">Created:</span> {new Date(store.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Store Description</h3>
                <p className="text-sm text-muted-foreground">
                  {store.info || "No description available for this store."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};