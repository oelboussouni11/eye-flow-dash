import React, { useState } from 'react';
import { Download, Upload, FileText, Package2, Loader2, CheckCircle, XCircle, Package, Contact, FileSpreadsheet } from 'lucide-react';
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

  const exportProductsTemplate = async () => {
    setExportProgress(10);
    
    const headers = [
      'name', 'description', 'sku', 'categoryId', 'price', 'cost', 
      'stock', 'minStock', 'supplier', 'brand', 'barcode', 'isActive'
    ];
    
    const sampleData = [
      [
        'Example Sunglasses',
        'Premium sunglasses with UV protection',
        'SUN001',
        'default-3',
        '129.99',
        '65.00',
        '25',
        '5',
        'Example Supplier',
        'Example Brand',
        '1234567890123',
        'true'
      ],
      [
        'Reading Glasses',
        'Comfortable reading glasses',
        'READ001',
        'default-0',
        '89.99',
        '45.00',
        '15',
        '3',
        'Vision Co',
        'ReadWell',
        '9876543210987',
        'true'
      ]
    ];

    setExportProgress(50);
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    setExportProgress(80);

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-template-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportProgress(100);
    toast.success('Products template exported successfully');
    
    setTimeout(() => {
      setExportProgress(0);
      setIsExportDialogOpen(false);
    }, 1000);
  };

  const exportContactLensesTemplate = async () => {
    setExportProgress(10);
    
    const headers = [
      'name', 'category', 'brand', 'type', 'material', 'diameter', 'baseCurve',
      'power', 'cylinder', 'axis', 'color', 'stock', 'minStock', 'price', 
      'cost', 'supplier', 'barcode', 'isActive'
    ];
    
    const sampleData = [
      [
        'Daily Disposable Lenses',
        'lentilles',
        'Acuvue',
        'daily',
        'Silicone Hydrogel',
        '14.0',
        '8.5',
        '-2.00',
        '',
        '',
        '',
        '100',
        '20',
        '45.99',
        '25.00',
        'Johnson & Johnson',
        '',
        'true'
      ],
      [
        'Multi-Purpose Solution',
        'produits',
        'ReNu',
        'solution',
        'Cleaning Solution',
        '',
        '',
        '',
        '',
        '',
        '',
        '50',
        '10',
        '12.99',
        '6.50',
        'Bausch + Lomb',
        '',
        'true'
      ]
    ];

    setExportProgress(50);
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    setExportProgress(80);

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact-lenses-template-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportProgress(100);
    toast.success('Contact lenses template exported successfully');
    
    setTimeout(() => {
      setExportProgress(0);
      setIsExportDialogOpen(false);
    }, 1000);
  };

  const exportCurrentProducts = async () => {
    setExportProgress(10);
    
    const headers = [
      'name', 'description', 'sku', 'categoryId', 'price', 'cost', 
      'stock', 'minStock', 'supplier', 'brand', 'barcode', 'isActive'
    ];
    
    const data = products.map(p => [
      p.name,
      p.description || '',
      p.sku,
      p.categoryId,
      p.price.toString(),
      p.cost.toString(),
      p.stock.toString(),
      p.minStock.toString(),
      p.supplier || '',
      p.brand || '',
      p.barcode || '',
      p.isActive.toString()
    ]);

    setExportProgress(50);
    
    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    setExportProgress(80);

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportProgress(100);
    toast.success('Products exported successfully');
    
    setTimeout(() => {
      setExportProgress(0);
      setIsExportDialogOpen(false);
    }, 1000);
  };

  const exportCurrentContactLenses = async () => {
    setExportProgress(10);
    
    const headers = [
      'name', 'category', 'brand', 'type', 'material', 'diameter', 'baseCurve',
      'power', 'cylinder', 'axis', 'color', 'stock', 'minStock', 'price', 
      'cost', 'supplier', 'barcode', 'isActive'
    ];
    
    const data = contactLenses.map(l => [
      l.name,
      l.category,
      l.brand,
      l.type || '',
      l.material || '',
      l.diameter?.toString() || '',
      l.baseCurve?.toString() || '',
      l.power || '',
      l.cylinder || '',
      l.axis?.toString() || '',
      l.color || '',
      l.stock.toString(),
      l.minStock.toString(),
      l.price.toString(),
      l.cost.toString(),
      l.supplier || '',
      l.barcode || '',
      l.isActive.toString()
    ]);

    setExportProgress(50);
    
    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    setExportProgress(80);

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact-lenses-export-${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportProgress(100);
    toast.success('Contact lenses exported successfully');
    
    setTimeout(() => {
      setExportProgress(0);
      setIsExportDialogOpen(false);
    }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const preview = parseCSVPreview(csvText);
        setImportPreview(preview);
      } catch (error) {
        toast.error('Invalid CSV file format');
        setImportFile(null);
      }
    };
    reader.readAsText(file);
  };

  const parseCSVPreview = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('Invalid CSV format');
    
    const headers = parseCSVLine(lines[0]);
    const dataLines = lines.slice(1);
    
    // Determine if it's products or contact lenses based on headers
    const isProductsFile = headers.includes('sku') && headers.includes('categoryId');
    const isContactLensesFile = headers.includes('category') && (headers.includes('power') || headers.includes('material'));
    
    return {
      type: isProductsFile ? 'products' : isContactLensesFile ? 'contact-lenses' : 'unknown',
      headers,
      rowCount: dataLines.length,
      sampleData: dataLines.slice(0, 3).map(line => parseCSVLine(line))
    };
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const processImport = async () => {
    if (!importPreview || !importFile) return;

    setImportProgress(10);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = parseCSVLine(lines[0]);
        const dataLines = lines.slice(1);

        setImportProgress(30);

        if (importPreview.type === 'products') {
          const importedProducts = dataLines.map((line, index) => {
            const values = parseCSVLine(line);
            const product: any = { id: `imported-product-${Date.now()}-${index}` };
            
            headers.forEach((header, i) => {
              const value = values[i]?.replace(/^"|"$/g, '') || '';
              switch (header) {
                case 'price':
                case 'cost':
                  product[header] = parseFloat(value) || 0;
                  break;
                case 'stock':
                case 'minStock':
                  product[header] = parseInt(value) || 0;
                  break;
                case 'isActive':
                  product[header] = value.toLowerCase() === 'true';
                  break;
                default:
                  product[header] = value;
              }
            });
            
            product.storeId = storeId;
            product.createdAt = new Date().toISOString();
            product.updatedAt = new Date().toISOString();
            product.images = [];
            
            return product;
          });

          onImportProducts(importedProducts);
          toast.success(`Imported ${importedProducts.length} products successfully`);
        }

        setImportProgress(70);

        if (importPreview.type === 'contact-lenses') {
          const importedLenses = dataLines.map((line, index) => {
            const values = parseCSVLine(line);
            const lens: any = { id: `imported-lens-${Date.now()}-${index}` };
            
            headers.forEach((header, i) => {
              const value = values[i]?.replace(/^"|"$/g, '') || '';
              switch (header) {
                case 'price':
                case 'cost':
                case 'diameter':
                case 'baseCurve':
                  lens[header] = parseFloat(value) || undefined;
                  break;
                case 'stock':
                case 'minStock':
                case 'axis':
                  lens[header] = parseInt(value) || 0;
                  break;
                case 'isActive':
                  lens[header] = value.toLowerCase() === 'true';
                  break;
                default:
                  lens[header] = value || undefined;
              }
            });
            
            lens.storeId = storeId;
            lens.createdAt = new Date().toISOString();
            lens.updatedAt = new Date().toISOString();
            lens.images = [];
            
            return lens;
          });

          onImportContactLenses(importedLenses);
          toast.success(`Imported ${importedLenses.length} contact lenses successfully`);
        }

        setImportProgress(100);
        
        setTimeout(() => {
          setImportProgress(0);
          setIsImportDialogOpen(false);
          setImportFile(null);
          setImportPreview(null);
        }, 1000);
        
      } catch (error) {
        toast.error('Error processing CSV file. Please check the format.');
        setImportProgress(0);
      }
    };
    
    reader.readAsText(importFile);
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
              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={exportProductsTemplate}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileSpreadsheet className="w-4 h-4 text-primary" />
                    Products Template
                  </CardTitle>
                  <CardDescription>
                    CSV template for importing products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      Excel Compatible
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Ready-to-use template with examples
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={exportContactLensesTemplate}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileSpreadsheet className="w-4 h-4 text-accent" />
                    Contact Lenses Template
                  </CardTitle>
                  <CardDescription>
                    CSV template for importing contact lenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      Excel Compatible
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Includes lens specifications fields
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={exportCurrentProducts}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package2 className="w-4 h-4 text-green-600" />
                    Export Products
                  </CardTitle>
                  <CardDescription>
                    Export current product inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {products.length} Products
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Backup your product data
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={exportCurrentContactLenses}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Contact className="w-4 h-4 text-orange-600" />
                    Export Contact Lenses
                  </CardTitle>
                  <CardDescription>
                    Export current contact lens inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {contactLenses.length} Lenses
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Backup your lens data
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
                      <h3 className="font-medium">Select CSV File</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload a CSV file with your inventory data
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Compatible with Excel, Google Sheets, and other spreadsheet applications
                      </p>
                    </div>
                    <label htmlFor="import-file" className="cursor-pointer">
                      <Button variant="outline" className="w-full" asChild>
                        <span>Choose CSV File</span>
                      </Button>
                      <input
                        id="import-file"
                        type="file"
                        accept=".csv"
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
                        <div className="flex gap-2">
                          <Badge variant="secondary">{(importFile.size / 1024).toFixed(1)} KB</Badge>
                          <Badge variant="outline" className="text-xs">CSV</Badge>
                        </div>
                      </div>
                      
                      {importPreview && (
                        <div className="space-y-2">
                          <Separator />
                          <h4 className="text-sm font-medium">Preview:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {importPreview.type === 'products' && <Package className="w-4 h-4 text-primary" />}
                              {importPreview.type === 'contact-lenses' && <Contact className="w-4 h-4 text-accent" />}
                              <span className="text-sm font-medium capitalize">
                                {importPreview.type === 'products' ? 'Products' : 
                                 importPreview.type === 'contact-lenses' ? 'Contact Lenses' : 'Unknown Type'}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>{importPreview.rowCount} rows found</p>
                              <p>Headers: {importPreview.headers.slice(0, 3).join(', ')}{importPreview.headers.length > 3 ? '...' : ''}</p>
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