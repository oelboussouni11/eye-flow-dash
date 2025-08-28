import React from 'react';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Invoices: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage sales, invoices, and transaction history
          </p>
        </div>
        
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Sale
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search invoices..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No invoices yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first sale to start generating invoices
        </p>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create First Sale
        </Button>
      </div>
    </div>
  );
};