import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Store } from '@/components/stores/StoreCard';
import { useAuth } from '@/contexts/AuthContext';

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (store: Omit<Store, 'id' | 'ownerId' | 'createdAt'>) => void;
  store?: Store | null;
  mode: 'create' | 'edit';
}

export const StoreFormModal: React.FC<StoreFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  store,
  mode
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    info: '',
    image: '',
    employeeCount: 0
  });

  useEffect(() => {
    if (store && mode === 'edit') {
      setFormData({
        name: store.name,
        address: store.address,
        info: store.info || '',
        image: store.image || '',
        employeeCount: store.employeeCount || 0
      });
    } else {
      setFormData({
        name: '',
        address: '',
        info: '',
        image: '',
        employeeCount: 0
      });
    }
  }, [store, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
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
        description: `Store ${mode === 'create' ? 'created' : 'updated'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} store`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            {mode === 'create' ? 'Create New Store' : 'Edit Store'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Store Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter store name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="bg-background"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address *
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter store address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              className="bg-background"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="info" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="info"
              placeholder="Store description or additional information"
              value={formData.info}
              onChange={(e) => handleInputChange('info', e.target.value)}
              rows={3}
              className="bg-background resize-none"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Store Image URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="bg-background"
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Employee Count */}
          <div className="space-y-2">
            <Label htmlFor="employeeCount" className="text-sm font-medium">
              Current Employee Count
            </Label>
            <Input
              id="employeeCount"
              type="number"
              min="0"
              placeholder="0"
              value={formData.employeeCount}
              onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
              className="bg-background"
            />
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
                mode === 'create' ? 'Create Store' : 'Update Store'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};