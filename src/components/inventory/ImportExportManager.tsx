import React, { useState } from 'react';
import { Download, Upload, FileText, Package2, Loader2, CheckCircle, XCircle, Package, Contact } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Product, ContactLens } from '@/types/inventory';

interface ImportExportManagerProps {
  storeId: string;
  products: Product[];
  contactLenses: ContactLens[];
  onImportProducts: (products: Product[]) => void;
  onImportContactLenses: (lenses: ContactLens[]) => void;
}

export const ImportExportManager: React.FC<ImportExportManagerProps> = ({
  storeId,
  products,
  contactLenses,
  onImportProducts,
  onImportContactLenses
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any>(null);

  const exportInventoryTemplate = async () => {
    setExportProgress(10);
    
    const template = {
      metadata: {
        version: "1.0",
        exportDate: new Date().toISOString(),
        storeId: storeId,
        description: "Inventory template for bulk import"
      },
      products: [
        {
          name: "Example Sunglasses",
          description: "Premium sunglasses with UV protection",
          sku: "SUN001",
          categoryId: "default-3",
          price: 129.99,
          cost: 65.00,
          stock: 25,
          minStock: 5,
          supplier: "Example Supplier",
          brand: "Example Brand",
          barcode: "1234567890123",
          isActive: true
        },
        {
          name: "Reading Glasses",
          description: "Comfortable reading glasses",
          sku: "READ001",
          categoryId: "default-0",
          price: 89.99,
          cost: 45.00,
          stock: 15,
          minStock: 3,
          supplier: "Vision Co",
          brand: "ReadWell",
          barcode: "9876543210987",
          isActive: true
        }
      ],
      contactLenses: [
        {
          name: "Daily Disposable Lenses",
          category: "lentilles",
          brand: "Acuvue",
          type: "daily",
          material: "Silicone Hydrogel",
          diameter: 14.0,
          baseCurve: 8.5,
          power: "-2.00",
          stock: 100,
          minStock: 20,
          price: 45.99,
          cost: 25.00,
          supplier: "Johnson & Johnson",
          isActive: true
        },
        {
          name: "Multi-Purpose Solution",
          category: "produits",
          brand: "ReNu",
          type: "solution",
          material: "Cleaning Solution",
          stock: 50,
          minStock: 10,
          price: 12.99,
          cost: 6.50,
          supplier: "Bausch + Lomb",
          isActive: true
        }
      ]
    };

    setExportProgress(50);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setExportProgress(80);

    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-template-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportProgress(100);
    toast.success('Template exported successfully');
    
    setTimeout(() => {
      setExportProgress(0);
      setIsExportDialogOpen(false);
    }, 1000);
  };

  const exportCurrentInventory = async () => {
    setExportProgress(10);
    
    const data = {
      metadata: {
        version: "1.0",
        exportDate: new Date().toISOString(),
        storeId: storeId,
        description: "Current inventory export",
        totalProducts: products.length,
        totalContactLenses: contactLenses.length
      },
      products: products.map(p => ({
        name: p.name,
        description: p.description,
        sku: p.sku,
        categoryId: p.categoryId,
        price: p.price,
        cost: p.cost,
        stock: p.stock,
        minStock: p.minStock,
        supplier: p.supplier,
        brand: p.brand,
        barcode: p.barcode,
        isActive: p.isActive
      })),
      contactLenses: contactLenses.map(l => ({
        name: l.name,
        category: l.category,
        brand: l.brand,
        type: l.type,
        material: l.material,
        diameter: l.diameter,
        baseCurve: l.baseCurve,
        power: l.power,
        cylinder: l.cylinder,
        axis: l.axis,
        color: l.color,
        stock: l.stock,
        minStock: l.minStock,
        price: l.price,
        cost: l.cost,
        supplier: l.supplier,
        barcode: l.barcode,
        isActive: l.isActive
      }))
    };

    setExportProgress(50);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setExportProgress(80);

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-export-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportProgress(100);
    toast.success('Inventory exported successfully');
    
    setTimeout(() => {
      setExportProgress(0);
      setIsExportDialogOpen(false);
    }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast.error('Please select a JSON file');
      return;
    }

    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setImportPreview(data);
      } catch (error) {
        toast.error('Invalid JSON file format');
        setImportFile(null);
      }
    };
    reader.readAsText(file);
  };

  const processImport = async () => {
    if (!importPreview) return;

    setImportProgress(10);
    
    let importedProductsCount = 0;
    let importedLensesCount = 0;

    try {
      if (importPreview.products && Array.isArray(importPreview.products)) {
        setImportProgress(30);
        
        const importedProducts = importPreview.products.map((p: any, index: number) => ({
          id: `imported-product-${Date.now()}-${index}`,
          ...p,
          storeId: storeId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          images: p.images || []
        }));
        
        onImportProducts(importedProducts);
        importedProductsCount = importedProducts.length;
      }

      setImportProgress(60);

      if (importPreview.contactLenses && Array.isArray(importPreview.contactLenses)) {
        const importedLenses = importPreview.contactLenses.map((l: any, index: number) => ({
          id: `imported-lens-${Date.now()}-${index}`,
          ...l,
          storeId: storeId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          images: l.images || []
        }));
        
        onImportContactLenses(importedLenses);
        importedLensesCount = importedLenses.length;
      }

      setImportProgress(100);
      
      toast.success(`Import successful! Added ${importedProductsCount} products and ${importedLensesCount} contact lenses`);
      
      setTimeout(() => {
        setImportProgress(0);
        setIsImportDialogOpen(false);
        setImportFile(null);
        setImportPreview(null);
      }, 1000);
      
    } catch (error) {
      toast.error('Error importing data. Please check file format.');
      setImportProgress(0);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Inventory
            </DialogTitle>
            <DialogDescription>
              Choose what you'd like to export from your inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {exportProgress > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Exporting...</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={exportInventoryTemplate}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="w-4 h-4 text-primary" />
                    Download Template
                  </CardTitle>
                  <CardDescription>
                    Get a template file with example data structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      Example Data Included
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Perfect for setting up bulk imports
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={exportCurrentInventory}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package2 className="w-4 h-4 text-green-600" />
                    Export Current
                  </CardTitle>
                  <CardDescription>
                    Export your existing inventory data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {products.length} Products
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {contactLenses.length} Lenses
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Backup or transfer your data
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Inventory
            </DialogTitle>
            <DialogDescription>
              Upload a JSON file to import products and contact lenses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {importProgress > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Importing data...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {!importFile ? (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">Select Import File</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Choose a JSON file with your inventory data
                      </p>
                    </div>
                    <label htmlFor="import-file" className="cursor-pointer">
                      <Button variant="outline" className="w-full" asChild>
                        <span>Choose File</span>
                      </Button>
                      <input
                        id="import-file"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      File Selected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{importFile.name}</span>
                        <Badge variant="secondary">{(importFile.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                      
                      {importPreview && (
                        <div className="space-y-2">
                          <Separator />
                          <h4 className="text-sm font-medium">Preview:</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" />
                              <span>{importPreview.products?.length || 0} Products</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Contact className="w-4 h-4 text-accent" />
                              <span>{importPreview.contactLenses?.length || 0} Contact Lenses</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setImportFile(null);
                      setImportPreview(null);
                    }}
                    className="flex-1"
                  >
                    Choose Different File
                  </Button>
                  <Button 
                    onClick={processImport}
                    disabled={!importPreview || importProgress > 0}
                    className="flex-1"
                  >
                    {importProgress > 0 ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Import Data'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};