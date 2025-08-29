import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Building2,
  FileImage,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PaymentRecord {
  id: string;
  month: string;
  year: number;
  amount: number;
  paymentDate: string;
  proofImage?: string;
  status: 'paid' | 'pending' | 'overdue';
}

export const Subscription: React.FC = () => {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingMonth, setUploadingMonth] = useState<string | null>(null);

  // Sample subscription data - replace with real data
  const subscriptionInfo = {
    planName: 'Professional Plan',
    monthlyPrice: 49.99,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    totalMonthsPaid: 8,
    totalMonthsRequired: 12
  };

  // Bank details for payment
  const bankDetails = {
    bankName: 'Beom Optic Bank',
    accountName: 'Beom Optic SaaS Solutions',
    iban: 'GB82 WEST 1234 5698 7654 32',
    bic: 'WESTGB2L',
    reference: "BEOM-ALLSTORES"
  };

  useEffect(() => {
    // Load payment records from localStorage
    const savedRecords = localStorage.getItem("subscription-payments-global");
    if (savedRecords) {
      setPaymentRecords(JSON.parse(savedRecords));
    } else {
      // Initialize with sample data
      const sampleRecords: PaymentRecord[] = [
        {
          id: '1',
          month: 'January',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-01-15',
          status: 'paid'
        },
        {
          id: '2', 
          month: 'February',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-02-14',
          status: 'paid'
        },
        {
          id: '3',
          month: 'March',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-03-12',
          status: 'paid'
        },
        {
          id: '4',
          month: 'April',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-04-10',
          status: 'paid'
        },
        {
          id: '5',
          month: 'May',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-05-08',
          status: 'paid'
        },
        {
          id: '6',
          month: 'June',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-06-05',
          status: 'paid'
        },
        {
          id: '7',
          month: 'July',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-07-03',
          status: 'paid'
        },
        {
          id: '8',
          month: 'August',
          year: 2024,
          amount: 49.99,
          paymentDate: '2024-08-01',
          status: 'paid'
        },
        {
          id: '9',
          month: 'September',
          year: 2024,
          amount: 49.99,
          paymentDate: '',
          status: 'pending'
        },
        {
          id: '10',
          month: 'October',
          year: 2024,
          amount: 49.99,
          paymentDate: '',
          status: 'pending'
        },
        {
          id: '11',
          month: 'November',
          year: 2024,
          amount: 49.99,
          paymentDate: '',
          status: 'pending'
        },
        {
          id: '12',
          month: 'December',
          year: 2024,
          amount: 49.99,
          paymentDate: '',
          status: 'pending'
        }
      ];
      setPaymentRecords(sampleRecords);
      localStorage.setItem("subscription-payments-global", JSON.stringify(sampleRecords));
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, monthId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadingMonth(monthId);
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        
        // Update payment record with proof image
        const updatedRecords = paymentRecords.map(record => {
          if (record.id === monthId) {
            return {
              ...record,
              proofImage: base64,
              paymentDate: new Date().toISOString().split('T')[0],
              status: 'paid' as const
            };
          }
          return record;
        });
        
        setPaymentRecords(updatedRecords);
        localStorage.setItem("subscription-payments-global", JSON.stringify(updatedRecords));
        setUploadingMonth(null);
        setSelectedFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const daysUntilExpiry = Math.ceil((new Date(subscriptionInfo.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img 
          src="/lovable-uploads/047f64ca-2cda-4a19-964a-13f5ac9d17ed.png" 
          alt="Beom Optic Logo" 
          className="w-12 h-12"
        />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Beom Optic Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and payment records for all stores
          </p>
        </div>
      </div>

      {/* Subscription Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionInfo.planName}</div>
            <p className="text-xs text-muted-foreground">
              ${subscriptionInfo.monthlyPrice}/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Months Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionInfo.totalMonthsPaid}/{subscriptionInfo.totalMonthsRequired}
            </div>
            <p className="text-xs text-muted-foreground">
              {((subscriptionInfo.totalMonthsPaid / subscriptionInfo.totalMonthsRequired) * 100).toFixed(0)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Ends</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(subscriptionInfo.endDate).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{subscriptionInfo.status}</div>
            <Badge className={subscriptionInfo.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800'}>
              {subscriptionInfo.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Bank Details for Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Bank Name</Label>
                <p className="text-sm text-muted-foreground">{bankDetails.bankName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Name</Label>
                <p className="text-sm text-muted-foreground">{bankDetails.accountName}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">IBAN</Label>
                <p className="text-sm font-mono bg-muted p-2 rounded">{bankDetails.iban}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">BIC/SWIFT</Label>
                <p className="text-sm font-mono bg-muted p-2 rounded">{bankDetails.bic}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Payment Reference</Label>
                <p className="text-sm font-mono bg-muted p-2 rounded">{bankDetails.reference}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Records */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload payment proofs for each month to track your subscription payments
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{record.month} {record.year}</h4>
                    <p className="text-sm text-muted-foreground">${record.amount}</p>
                  </div>
                  {record.paymentDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Paid on</p>
                      <p className="text-sm font-medium">{new Date(record.paymentDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(record.status)}
                  
                  {record.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, record.id)}
                        className="hidden"
                        id={`file-${record.id}`}
                      />
                      <Label htmlFor={`file-${record.id}`} className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Proof
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}

                  {record.proofImage && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(record.proofImage, '_blank')}
                    >
                      <FileImage className="w-4 h-4 mr-2" />
                      View Proof
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};