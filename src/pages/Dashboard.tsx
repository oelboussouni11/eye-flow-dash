import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Activity, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { StoreCard, Store } from '@/components/stores/StoreCard';
import { StoreFormModal } from '@/components/stores/StoreFormModal';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TaxConfiguration } from '@/components/dashboard/TaxConfiguration';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Dashboard: React.FC = () => {
  const { user, isOwner } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStoreId, setDeletingStoreId] = useState<string | null>(null);

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
    if (!isOwner && !user?.permissions?.stores?.includes('create')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create stores",
        variant: "destructive"
      });
      return;
    }
    setEditingStore(null);
    setIsModalOpen(true);
  };

  const handleEditStore = (store: Store) => {
    if (!isOwner && !user?.permissions?.stores?.includes('update')) {
      toast({
        title: "Access Denied", 
        description: "You don't have permission to edit stores",
        variant: "destructive"
      });
      return;
    }
    setEditingStore(store);
    setIsModalOpen(true);
  };

  const handleStoreSubmit = (storeData: Omit<Store, 'id' | 'ownerId' | 'createdAt'>) => {
    const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
    
    if (editingStore) {
      // Update existing store
      const updatedStores = allStores.map((store: Store) =>
        store.id === editingStore.id 
          ? { ...store, ...storeData }
          : store
      );
      localStorage.setItem('opti_stores', JSON.stringify(updatedStores));
      setStores(prev => prev.map(store => 
        store.id === editingStore.id 
          ? { ...store, ...storeData }
          : store
      ));
    } else {
      // Create new store
      const newStore: Store = {
        id: Date.now().toString(),
        ...storeData,
        ownerId: user?.id || '',
        createdAt: new Date().toISOString()
      };
      
      allStores.push(newStore);
      localStorage.setItem('opti_stores', JSON.stringify(allStores));
      setStores(prev => [...prev, newStore]);
    }
  };

  const handleDeleteStore = (storeId: string) => {
    if (!isOwner && !user?.permissions?.stores?.includes('delete')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete stores", 
        variant: "destructive"
      });
      return;
    }
    setDeletingStoreId(storeId);
  };

  const confirmDeleteStore = () => {
    if (!deletingStoreId) return;
    
    const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
    const updatedStores = allStores.filter((store: Store) => store.id !== deletingStoreId);
    localStorage.setItem('opti_stores', JSON.stringify(updatedStores));
    
    setStores(prev => prev.filter(store => store.id !== deletingStoreId));
    setDeletingStoreId(null);
    
    toast({
      title: "Success!",
      description: "Store deleted successfully"
    });
  };

  const handleViewStore = (store: Store) => {
    navigate(`/store/${store.id}`);
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = stores.reduce((sum, store) => sum + (store.employeeCount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}! Here's what's happening with your business.
          </p>
        </div>
        
        {(isOwner || user?.permissions?.stores?.includes('create')) && (
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

      {/* Stats Grid */}
      <StatsGrid 
        totalStores={stores.length}
        totalEmployees={totalEmployees}
        totalClients={156}
        totalProducts={89}
        monthlyRevenue={12450}
        activeStores={stores.length}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stores Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {isOwner ? 'Your Stores' : 'Assigned Stores'}
            </h2>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Store Grid */}
          {filteredStores.length === 0 ? (
            <div className="text-center py-12 bg-gradient-card rounded-lg border border-border">
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
          {stores.length === 0 && (isOwner || user?.permissions?.stores?.includes('create')) && (
            <Button variant="primary" onClick={handleCreateStore}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Store
            </Button>
          )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onEdit={(isOwner || user?.permissions?.stores?.includes('update')) ? handleEditStore : undefined}
                  onDelete={(isOwner || user?.permissions?.stores?.includes('delete')) ? handleDeleteStore : undefined}
                  onView={handleViewStore}
                  canEdit={isOwner || user?.permissions?.stores?.includes('update')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
          <TaxConfiguration />
          <RecentActivity />
        </div>
      </div>

      {/* Store Form Modal */}
      <StoreFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleStoreSubmit}
        store={editingStore}
        mode={editingStore ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingStoreId} onOpenChange={() => setDeletingStoreId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this store? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStore}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Store
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};