import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { ClientDetailsModal } from '@/components/clients/ClientDetailsModal';
import { Client } from '@/types/client';
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

export const StoreClients: React.FC = () => {
  const { storeId } = useParams();
  const { user, isOwner } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  useEffect(() => {
    loadStoreClients();
  }, [storeId, user]);

  const loadStoreClients = () => {
    try {
      const allClients = JSON.parse(localStorage.getItem('opti_clients') || '[]');
      const storeClients = allClients.filter((client: Client) => client.storeId === storeId);
      setClients(storeClients);
    } catch (error) {
      console.error('Error loading store clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = () => {
    if (!isOwner && !user?.permissions?.clients?.includes('create')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create clients",
        variant: "destructive"
      });
      return;
    }
    setEditingClient(null);
    setIsFormModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    if (!isOwner && !user?.permissions?.clients?.includes('update')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit clients",
        variant: "destructive"
      });
      return;
    }
    setEditingClient(client);
    setIsFormModalOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (!isOwner && !user?.permissions?.clients?.includes('delete')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete clients",
        variant: "destructive"
      });
      return;
    }
    setDeletingClientId(clientId);
  };

  const confirmDelete = () => {
    if (!deletingClientId) return;

    try {
      const allClients = JSON.parse(localStorage.getItem('opti_clients') || '[]');
      const updatedClients = allClients.filter((client: Client) => client.id !== deletingClientId);
      localStorage.setItem('opti_clients', JSON.stringify(updatedClients));
      
      setClients(clients.filter(client => client.id !== deletingClientId));
      setDeletingClientId(null);
      
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive"
      });
    }
  };

  const handleSubmitClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const allClients = JSON.parse(localStorage.getItem('opti_clients') || '[]');
      
      if (editingClient) {
        // Update existing client
        const updatedClient: Client = {
          ...clientData,
          id: editingClient.id,
          storeId: storeId, // Ensure client stays with this store
          createdAt: editingClient.createdAt,
          updatedAt: new Date().toISOString()
        };
        
        const updatedClients = allClients.map((client: Client) =>
          client.id === editingClient.id ? updatedClient : client
        );
        
        localStorage.setItem('opti_clients', JSON.stringify(updatedClients));
        setClients(clients.map(client => client.id === editingClient.id ? updatedClient : client));
        
        toast({
          title: "Success",
          description: "Client updated successfully"
        });
      } else {
        // Create new client
        const newClient: Client = {
          ...clientData,
          id: Date.now().toString(),
          storeId: storeId, // Assign to this store
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const updatedClients = [...allClients, newClient];
        localStorage.setItem('opti_clients', JSON.stringify(updatedClients));
        setClients([...clients, newClient]);
        
        toast({
          title: "Success",
          description: "Client created successfully"
        });
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Error",
        description: "Failed to save client",
        variant: "destructive"
      });
    }
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm)
    );
  });

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage clients for this specific store
          </p>
        </div>
        
        {(isOwner || user?.permissions?.clients?.includes('create')) && (
          <Button variant="primary" onClick={handleCreateClient} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search clients..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {clients.length === 0 ? 'No clients yet' : 'No clients found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {clients.length === 0 
              ? 'Add your first client to start managing store customers'
              : 'Try adjusting your search terms'
            }
          </p>
          {clients.length === 0 && (isOwner || user?.permissions?.clients?.includes('create')) && (
            <Button variant="primary" onClick={handleCreateClient}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Client
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={(isOwner || user?.permissions?.clients?.includes('update')) ? handleEditClient : undefined}
              onDelete={(isOwner || user?.permissions?.clients?.includes('delete')) ? handleDeleteClient : undefined}
              onView={handleViewClient}
              canEdit={isOwner || user?.permissions?.clients?.includes('update')}
            />
          ))}
        </div>
      )}

      <ClientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitClient}
        client={editingClient}
        storeId={storeId}
      />

      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleEditClient}
        client={viewingClient}
        canEdit={isOwner || user?.permissions?.clients?.includes('update')}
      />

      <AlertDialog open={!!deletingClientId} onOpenChange={() => setDeletingClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
              All associated prescriptions and history will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};