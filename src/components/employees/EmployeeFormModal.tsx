import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Employee {
  id: string;
  name: string;
  email: string;
  username: string;
  ownerId: string;
  assignedStores: string[];
  permissions: {
    clients: ('create' | 'read' | 'update' | 'delete')[];
    inventory: ('create' | 'read' | 'update' | 'delete')[];
    invoices: ('create' | 'read' | 'update' | 'delete')[];
    stores: ('create' | 'read' | 'update' | 'delete')[];
  };
  createdAt: string;
}

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Omit<Employee, 'id' | 'ownerId' | 'createdAt'>) => void;
  employee?: Employee | null;
  mode: 'create' | 'edit';
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
  mode
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    assignedStores: [] as string[],
    permissions: {
      clients: [] as ('create' | 'read' | 'update' | 'delete')[],
      inventory: [] as ('create' | 'read' | 'update' | 'delete')[],
      invoices: [] as ('create' | 'read' | 'update' | 'delete')[],
      stores: [] as ('create' | 'read' | 'update' | 'delete')[]
    }
  });

  useEffect(() => {
    // Load owner's stores
    const allStores = JSON.parse(localStorage.getItem('opti_stores') || '[]');
    const ownerStores = allStores.filter((store: any) => store.ownerId === user?.id);
    setStores(ownerStores);
  }, [user]);

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        name: employee.name,
        email: employee.email,
        username: employee.username,
        assignedStores: employee.assignedStores,
        permissions: employee.permissions
      });
    } else {
      setFormData({
        name: '',
        email: '',
        username: '',
        assignedStores: [],
        permissions: {
          clients: ['read'],
          inventory: ['read'],
          invoices: ['read'],
          stores: ['read']
        }
      });
    }
  }, [employee, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
      toast({
        title: "Success!",
        description: `Employee ${mode === 'create' ? 'created' : 'updated'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} employee`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStoreToggle = (storeId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedStores: prev.assignedStores.includes(storeId)
        ? prev.assignedStores.filter(id => id !== storeId)
        : [...prev.assignedStores, storeId]
    }));
  };

  const handlePermissionToggle = (section: keyof typeof formData.permissions, permission: 'create' | 'read' | 'update' | 'delete') => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: prev.permissions[section].includes(permission)
          ? prev.permissions[section].filter(p => p !== permission)
          : [...prev.permissions[section], permission]
      }
    }));
  };

  const permissionSections = [
    { key: 'clients', label: 'Clients' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'stores', label: 'Stores' }
  ] as const;

  const permissionTypes = ['create', 'read', 'update', 'delete'] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <User className="w-5 h-5 text-primary" />
            {mode === 'create' ? 'Add New Employee' : 'Edit Employee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Store Assignment */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Store className="w-4 h-4" />
              Store Access
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={formData.assignedStores.includes(store.id)}
                    onCheckedChange={() => handleStoreToggle(store.id)}
                  />
                  <Label htmlFor={`store-${store.id}`} className="flex-1 cursor-pointer">
                    {store.name}
                    <span className="text-xs text-muted-foreground ml-2">
                      {store.address}
                    </span>
                  </Label>
                </div>
              ))}
              
              {stores.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No stores available. Create stores first to assign employees.
                </p>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Permissions
            </h3>
            
            <div className="space-y-4">
              {permissionSections.map((section) => (
                <div key={section.key} className="space-y-2">
                  <Label className="text-sm font-medium">{section.label}</Label>
                  <div className="flex flex-wrap gap-2">
                    {permissionTypes.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${section.key}-${permission}`}
                          checked={formData.permissions[section.key].includes(permission)}
                          onCheckedChange={() => handlePermissionToggle(section.key, permission)}
                        />
                        <Label 
                          htmlFor={`${section.key}-${permission}`}
                          className="text-xs cursor-pointer capitalize"
                        >
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </div>
              ) : (
                mode === 'create' ? 'Create Employee' : 'Update Employee'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};