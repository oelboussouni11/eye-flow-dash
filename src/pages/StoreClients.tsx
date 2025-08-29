import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Filter, Users, Download, Upload, FileText } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // CSV Export function
  const exportToCSV = () => {
    if (clients.length === 0) {
      toast({
        title: "No Data",
        description: "No clients to export",
        variant: "destructive"
      });
      return;
    }

    const csvHeaders = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'street', 'city', 'state', 'zipCode', 'country',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship',
      'insuranceProvider', 'insurancePolicyNumber', 'insuranceGroupNumber',
      'status', 'preferredContactMethod', 'tags'
    ];

    const csvData = clients.map(client => [
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
      client.emergencyContact.name || '',
      client.emergencyContact.phone || '',
      client.emergencyContact.relationship || '',
      client.insurance?.provider || '',
      client.insurance?.policyNumber || '',
      client.insurance?.groupNumber || '',
      client.status,
      client.preferredContactMethod,
      client.tags.join(';')
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: `Exported ${clients.length} clients to CSV`
    });
  };

  // CSV Template Download
  const downloadTemplate = () => {
    const templateHeaders = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'street', 'city', 'state', 'zipCode', 'country',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship',
      'insuranceProvider', 'insurancePolicyNumber', 'insuranceGroupNumber',
      'status', 'preferredContactMethod', 'tags'
    ];

    const templateRow = [
      'John', 'Doe', 'john.doe@email.com', '+1234567890', '1990-01-01',
      '123 Main St', 'Anytown', 'CA', '12345', 'USA',
      'Jane Doe', '+1234567891', 'Spouse',
      'Vision Insurance Co', 'POL123456', 'GRP789',
      'active', 'email', 'VIP;Regular Customer'
    ];

    const csvContent = [templateHeaders, templateRow]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'client_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded",
      description: "CSV template downloaded successfully"
    });
  };

  // CSV Import function
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        if (lines.length < 2) {
          toast({
            title: "Empty File",
            description: "CSV file contains no data rows",
            variant: "destructive"
          });
          return;
        }

        const importedClients: Client[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          try {
            const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
            
            if (values.length < headers.length) continue;

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
              insurance: {
                provider: values[13] || '',
                policyNumber: values[14] || '',
                groupNumber: values[15] || ''
              },
              status: (values[16] === 'active' || values[16] === 'inactive') ? values[16] as 'active' | 'inactive' : 'active',
              preferredContactMethod: (values[17] === 'email' || values[17] === 'phone' || values[17] === 'sms') ? values[17] as 'email' | 'phone' | 'sms' : 'email',
              tags: values[18] ? values[18].split(';').filter(tag => tag.trim()) : [],
              prescriptionHistory: [],
              clientHistory: [],
              totalSpent: 0,
              ownerId: user?.id || '',
              storeId: storeId || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            // Basic validation
            if (!clientData.firstName || !clientData.lastName || !clientData.email) {
              errors.push(`Row ${i + 1}: Missing required fields (firstName, lastName, email)`);
              continue;
            }

            importedClients.push(clientData);
          } catch (error) {
            errors.push(`Row ${i + 1}: Invalid data format`);
          }
        }

        if (importedClients.length === 0) {
          toast({
            title: "Import Failed",
            description: "No valid clients found in CSV file",
            variant: "destructive"
          });
          return;
        }

        // Save imported clients
        const allClients = JSON.parse(localStorage.getItem('opti_clients') || '[]');
        const updatedClients = [...allClients, ...importedClients];
        localStorage.setItem('opti_clients', JSON.stringify(updatedClients));
        
        setClients([...clients, ...importedClients]);

        toast({
          title: "Import Successful",
          description: `Imported ${importedClients.length} clients${errors.length > 0 ? ` (${errors.length} errors)` : ''}`
        });

        if (errors.length > 0) {
          console.warn('Import errors:', errors);
        }

      } catch (error) {
        console.error('CSV import error:', error);
        toast({
          title: "Import Failed",
          description: "Error processing CSV file",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    if (!isOwner && !user?.permissions?.clients?.includes('create')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to import clients",
        variant: "destructive"
      });
      return;
    }
    fileInputRef.current?.click();
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
        
        <div className="flex items-center gap-2">
          {/* CSV Import/Export Controls */}
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Template
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="flex items-center gap-2"
            disabled={clients.length === 0}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          {(isOwner || user?.permissions?.clients?.includes('create')) && (
            <Button 
              variant="outline" 
              onClick={triggerFileUpload}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </Button>
          )}

          {(isOwner || user?.permissions?.clients?.includes('create')) && (
            <Button variant="primary" onClick={handleCreateClient} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          )}
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
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