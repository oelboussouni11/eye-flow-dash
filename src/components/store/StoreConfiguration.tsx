import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Settings, Building, DollarSign, FileImage } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface StoreConfig {
  logo?: string;
  taxRate: number;
  storeName: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
}

export const StoreConfiguration: React.FC = () => {
  const { storeId } = useParams();
  const [config, setConfig] = useState<StoreConfig>(() => {
    const savedConfig = localStorage.getItem(`store-${storeId}-config`);
    return savedConfig ? JSON.parse(savedConfig) : {
      taxRate: 16,
      storeName: 'OptiVision Store',
      address: '123 Main Street, City, State 12345',
      phone: '(555) 123-4567',
      email: 'info@optivision.com',
      taxId: '123-456-789'
    };
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo file size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoDataUrl = e.target?.result as string;
        setConfig(prev => ({ ...prev, logo: logoDataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (config.taxRate < 0 || config.taxRate > 100) {
      toast.error('Tax rate must be between 0 and 100');
      return;
    }

    localStorage.setItem(`store-${storeId}-config`, JSON.stringify(config));
    toast.success('Store configuration saved successfully');
  };

  const handleReset = () => {
    const savedConfig = localStorage.getItem(`store-${storeId}-config`);
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
      toast.info('Configuration reset to saved values');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle>Store Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload Section */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Store Logo
          </Label>
          <div className="flex items-start gap-4">
            {config.logo && (
              <div className="flex-shrink-0">
                <img 
                  src={config.logo} 
                  alt="Store logo" 
                  className="w-24 h-24 object-contain border rounded-lg bg-white p-2"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Upload your store logo (PNG, JPG, SVG - Max 2MB). This will appear on invoices.
              </p>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={config.storeName}
              onChange={(e) => setConfig(prev => ({ ...prev, storeName: e.target.value }))}
              placeholder="Enter store name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={config.taxRate}
              onChange={(e) => setConfig(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
              placeholder="Enter tax rate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={config.phone}
              onChange={(e) => setConfig(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={config.email}
              onChange={(e) => setConfig(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / Business Number</Label>
            <Input
              id="taxId"
              value={config.taxId}
              onChange={(e) => setConfig(prev => ({ ...prev, taxId: e.target.value }))}
              placeholder="Enter tax ID"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Store Address</Label>
          <Textarea
            id="address"
            value={config.address}
            onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter complete store address"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
          <strong>Note:</strong> This configuration applies only to this store. The logo and information will be used on all invoices generated for this store.
        </div>
      </CardContent>
    </Card>
  );
};