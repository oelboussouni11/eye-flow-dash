import React from 'react';
import { FileSpreadsheet, Download, AlertCircle, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const TemplateGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Templates Location:</strong> Click the "Export" button above to access CSV templates for bulk importing products and contact lenses.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              Products Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">Excel Compatible</Badge>
              <p className="text-xs text-muted-foreground">
                Download CSV template with example products. Edit in Excel/Google Sheets and import back.
              </p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Fields included:</strong></p>
                <p>Name, SKU, Price, Stock, Category, Brand, etc.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="w-4 h-4 text-accent" />
              Contact Lenses Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">Excel Compatible</Badge>
              <p className="text-xs text-muted-foreground">
                Download CSV template for contact lenses and care products.
              </p>
              <div className="text-xs text-muted-foreground">
                <p><strong>Fields included:</strong></p>
                <p>Power, Diameter, Base Curve, Brand, Type, etc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            How to use templates:
          </p>
          <ol className="text-xs text-blue-700 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Click "Export" → Download the template you need</li>
            <li>Open the CSV file in Excel or Google Sheets</li>
            <li>Fill in your product/lens data following the examples</li>
            <li>Save as CSV and use "Import" to upload back</li>
          </ol>
        </div>
      </div>
    </div>
  );
};