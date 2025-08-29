import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, Download, Upload, FileDown } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Clients: React.FC = () => {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadClients();
  }, [user]);

  const loadClients = () => {
    try {
      const allClients = JSON.parse(localStorage.getItem('opti_clients') || '[]');
      let userClients = allClients;

      if (!isOwner) {
        // Filter clients based on user's assigned stores or permissions
        userClients = allClients.filter((client: Client) => {
          if (user?.assignedStores) {
            return user.assignedStores.includes(client.storeId || '');
          }
          return false;
        });
      }

      setClients(userClients);
    } catch (error) {
      console.error('Error loading clients:', error);
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

  const generateCSVTemplate = () => {
    const headers = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'dateOfBirth',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
      'emergencyContactName',
      'emergencyContactPhone',
      'emergencyContactRelationship',
      'insuranceProvider',
      'insurancePolicyNumber',
      'insuranceGroupNumber',
      'status',
      'preferredContactMethod',
      'tags'
    ];
    
    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully"
    });
  };

  const exportClientsToCSV = () => {
    if (clients.length === 0) {
      toast({
        title: "No Data",
        description: "No clients to export",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'firstName',
      'lastName',
      'email', 
      'phone',
      'dateOfBirth',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
      'emergencyContactName',
      'emergencyContactPhone',
      'emergencyContactRelationship',
      'insuranceProvider',
      'insurancePolicyNumber',
      'insuranceGroupNumber',
      'status',
      'preferredContactMethod',
      'tags',
      'totalSpent',
      'lastVisit',
      'createdAt'
    ];

    const csvContent = [
      headers.join(','),
      ...clients.map(client => [
        client.firstName,
        client.lastName,
        client.email,
        client.phone,
        client.dateOfBirth,
        client.address.street,
        client.address.city,
        client.address.state,
        client.address.zipCode,
        client.address.country,
        client.emergencyContact.name,
        client.emergencyContact.phone,
        client.emergencyContact.relationship,
        client.insurance?.provider || '',
        client.insurance?.policyNumber || '',
        client.insurance?.groupNumber || '',
        client.status,
        client.preferredContactMethod,
        client.tags.join(';'),
        client.totalSpent,
        client.lastVisit || '',
        client.createdAt
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete", 
      description: `${clients.length} clients exported successfully`
    });
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const importedClients: Client[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          
          if (values.length >= headers.length) {
            const clientData: Client = {
              id: Date.now().toString() + i,
              firstName: values[0] || '',
              lastName: values[1] || '',
              email: values[2] || '',
              phone: values[3] || '',
              dateOfBirth: values[4] || '',
              address: {
                street: values[5] || '',
                city: values[6] || '',
                state: values[7] || '',
                zipCode: values[8] || '',
                country: values[9] || 'USA'
              },
              emergencyContact: {
                name: values[10] || '',
                phone: values[11] || '',
                relationship: values[12] || ''
              },
              insurance: values[13] ? {
                provider: values[13] || '',
                policyNumber: values[14] || '',
                groupNumber: values[15] || ''
              } : undefined,
              status: (values[16] as 'active' | 'inactive') || 'active',
              preferredContactMethod: (values[17] as 'email' | 'phone' | 'sms') || 'email',
              tags: values[18] ? values[18].split(';').filter(t => t.trim()) : [],
              prescriptionHistory: [],
              clientHistory: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ownerId: user?.id || '',
              totalSpent: 0
            };
            
            importedClients.push(clientData);
          }
        }

        if (importedClients.length > 0) {
          const allClients = JSON.parse(localStorage.getItem('opti_clients') || '[]');
          const updatedClients = [...allClients, ...importedClients];
          localStorage.setItem('opti_clients', JSON.stringify(updatedClients));
          setClients([...clients, ...importedClients]);
          
          toast({
            title: "Import Successful",
            description: `${importedClients.length} clients imported successfully`
          });
        } else {
          toast({
            title: "Import Failed",
            description: "No valid client data found in the CSV file",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error importing CSV:', error);
        toast({
          title: "Import Error", 
          description: "Failed to import CSV file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Clients
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your customers and their optical prescriptions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export/Import Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={generateCSVTemplate}>
                <FileDown className="w-4 h-4 mr-2" />
                Download Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportClientsToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import from CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(isOwner || user?.permissions?.clients?.includes('create')) && (
            <Button 
              variant="primary" 
              onClick={handleCreateClient} 
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          )}
        </div>
      </div>

      {/* Hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImportCSV}
        className="hidden"
      />

      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search clients by name, email, or phone..." 
            className="pl-10 bg-background/80 border-border/50 focus:border-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-background/50">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {clients.length === 0 ? 'No clients yet' : 'No clients found'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {clients.length === 0 
              ? 'Start building your customer database by adding your first client'
              : 'Try adjusting your search terms or import clients from CSV'
            }
          </p>
          {clients.length === 0 && (isOwner || user?.permissions?.clients?.includes('create')) && (
            <div className="flex items-center gap-3 justify-center">
              <Button 
                variant="primary" 
                onClick={handleCreateClient}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Client
              </Button>
              <Button variant="outline" onClick={generateCSVTemplate}>
                <FileDown className="w-4 h-4 mr-2" />
                Get Template
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
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