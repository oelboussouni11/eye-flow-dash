import React, { useState } from 'react';
import { Plus, Eye, Calendar, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrescriptionHistory as PrescriptionHistoryType } from '@/types/client';

interface PrescriptionHistoryProps {
  prescriptions: PrescriptionHistoryType[];
  clientId: string;
  canEdit?: boolean;
}

export const PrescriptionHistory: React.FC<PrescriptionHistoryProps> = ({
  prescriptions,
  clientId,
  canEdit = true
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPrescriptionTypeColor = (type: string) => {
    switch (type) {
      case 'glasses':
        return 'default';
      case 'contact_lenses':
        return 'secondary';
      case 'sunglasses':
        return 'outline';
      default:
        return 'default';
    }
  };

  const formatPrescription = (eye: { sphere: number; cylinder: number; axis: number; add?: number }) => {
    const sphere = eye.sphere > 0 ? `+${eye.sphere}` : eye.sphere.toString();
    const cylinder = eye.cylinder !== 0 ? ` ${eye.cylinder > 0 ? '+' : ''}${eye.cylinder}` : '';
    const axis = eye.cylinder !== 0 ? ` x ${eye.axis}°` : '';
    const add = eye.add ? ` ADD ${eye.add > 0 ? '+' : ''}${eye.add}` : '';
    
    return `${sphere}${cylinder}${axis}${add}`;
  };

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Prescriptions</h3>
          <p className="text-muted-foreground mb-4">
            This client doesn't have any prescription history yet
          </p>
          {canEdit && (
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add First Prescription
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Prescription History</h3>
        {canEdit && (
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Prescription
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">
                      {prescription.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                    <Badge variant={getPrescriptionTypeColor(prescription.type)}>
                      {prescription.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(prescription.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {formatCurrency(prescription.cost)}
                    </div>
                    {prescription.doctorName && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Dr. {prescription.doctorName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Prescription Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Right Eye (OD)</h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-mono text-sm">{formatPrescription(prescription.rightEye)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Left Eye (OS)</h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-mono text-sm">{formatPrescription(prescription.leftEye)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">PD</h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-mono text-sm">{prescription.pd}mm</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {(prescription.frame || prescription.lensType || prescription.coating) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {prescription.frame && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Frame</p>
                      <p className="font-medium">{prescription.frame}</p>
                    </div>
                  )}
                  {prescription.lensType && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Lens Type</p>
                      <p className="font-medium">{prescription.lensType}</p>
                    </div>
                  )}
                  {prescription.coating && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Coating</p>
                      <p className="font-medium">{prescription.coating}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {prescription.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Notes</h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{prescription.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};