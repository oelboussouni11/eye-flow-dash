import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { StoreCard, Store } from '@/components/stores/StoreCard';
import { useToast } from '@/hooks/use-toast';

export const Dashboard: React.FC = () => {
  const { user, isOwner } = useAuth();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, [user]);

  const loadStores = () => {
    try {
      const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
      let userStores = allStores;

      if (!isOwner && user?.assignedStores) {
        // Employee sees only assigned stores
        userStores = allStores.filter((store: Store) => 
          user.assignedStores?.includes(store.id)
        );
      } else if (!isOwner) {
        // Employee with no assigned stores
        userStores = [];
      } else {
        // Owner sees their own stores
        userStores = allStores.filter((store: Store) => store.ownerId === user?.id);
      }

      setStores(userStores);
    } catch (error) {
      console.error('Error loading stores:', error);
      toast({
        title: "Error",
        description: "Failed to load stores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = () => {
    // For now, create a sample store
    const newStore: Store = {
      id: Date.now().toString(),
      name: `New Store ${stores.length + 1}`,
      address: '123 Main Street, City',
      info: 'A professional optical store providing comprehensive eye care services.',
      ownerId: user?.id || '',
      employeeCount: 0,
      createdAt: new Date().toISOString()
    };

    const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
    allStores.push(newStore);
    localStorage.setItem('opti_stores', JSON.stringify(allStores));
    
    setStores(prev => [...prev, newStore]);
    
    toast({
      title: "Success!",
      description: "Store created successfully"
    });
  };

  const handleEditStore = (store: Store) => {
    toast({
      title: "Edit Store",
      description: "Edit functionality will be implemented soon"
    });
  };

  const handleDeleteStore = (storeId: string) => {
    const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
    const updatedStores = allStores.filter((store: Store) => store.id !== storeId);
    localStorage.setItem('opti_stores', JSON.stringify(updatedStores));
    
    setStores(prev => prev.filter(store => store.id !== storeId));
    
    toast({
      title: "Success!",
      description: "Store deleted successfully"
    });
  };

  const handleViewStore = (store: Store) => {
    toast({
      title: "Store Dashboard",
      description: `Opening dashboard for ${store.name}`
    });
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isOwner ? 'Your Stores' : 'Assigned Stores'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isOwner 
              ? 'Manage and monitor your optical store locations' 
              : 'Stores you have access to'
            }
          </p>
        </div>
        
        {isOwner && (
          <Button 
            variant="primary" 
            onClick={handleCreateStore}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Store
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Store Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {stores.length === 0 ? 'No stores yet' : 'No stores found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {stores.length === 0 
              ? (isOwner ? 'Create your first store to get started' : 'No stores assigned to you yet')
              : 'Try adjusting your search terms'
            }
          </p>
          {isOwner && stores.length === 0 && (
            <Button variant="primary" onClick={handleCreateStore}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Store
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onEdit={handleEditStore}
              onDelete={handleDeleteStore}
              onView={handleViewStore}
              canEdit={isOwner}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {stores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-primary">{stores.length}</div>
            <div className="text-sm text-muted-foreground">Total Stores</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-primary">
              {stores.reduce((sum, store) => sum + (store.employeeCount || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Employees</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-border">
            <div className="text-2xl font-bold text-primary">Active</div>
            <div className="text-sm text-muted-foreground">Status</div>
          </div>
        </div>
      )}
    </div>
  );
};