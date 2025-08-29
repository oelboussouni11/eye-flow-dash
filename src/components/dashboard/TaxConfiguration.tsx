import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useTax } from '@/contexts/TaxContext';
import { toast } from 'sonner';

export const TaxConfiguration: React.FC = () => {
  const { taxRate, setTaxRate } = useTax();
  const [tempTaxRate, setTempTaxRate] = useState(taxRate.toString());

  const handleSave = () => {
    const newRate = parseFloat(tempTaxRate);
    if (isNaN(newRate) || newRate < 0 || newRate > 100) {
      toast.error('Please enter a valid tax rate between 0 and 100');
      return;
    }
    
    setTaxRate(newRate);
    toast.success('Tax rate updated successfully');
  };

  const handleReset = () => {
    setTempTaxRate(taxRate.toString());
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tax Configuration</CardTitle>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <div className="flex gap-2">
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={tempTaxRate}
              onChange={(e) => setTempTaxRate(e.target.value)}
              placeholder="Enter tax rate"
            />
            <Button onClick={handleSave} size="sm">
              Save
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              Reset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Current rate: {taxRate}% - This will apply to all new sales
          </p>
        </div>
      </CardContent>
    </Card>
  );
};