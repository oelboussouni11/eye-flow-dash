import React, { useState } from 'react';
import { X, Edit, Calendar, Phone, Mail, MapPin, User, Clock, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Client } from '@/types/client';
import { PrescriptionHistory } from './PrescriptionHistory';
import { ClientHistory } from './ClientHistory';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: Client) => void;
  client: Client | null;
  canEdit?: boolean;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  client,
  canEdit = true
}) => {
  if (!client) return null;

  const fullName = `${client.firstName} ${client.lastName}`;
  const initials = `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{fullName}</DialogTitle>
                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </div>
                  <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                    {client.status}
                  </Badge>
                </div>
              </div>
            </div>
            {canEdit && (
              <Button variant="outline" onClick={() => onEdit(client)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Client
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(client.dateOfBirth)} ({calculateAge(client.dateOfBirth)} years old)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Preferred Contact</p>
                    <p className="font-medium capitalize">{client.preferredContactMethod}</p>
                  </div>
                  {client.lastVisit && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Visit</p>
                      <p className="font-medium">{formatDate(client.lastVisit)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>{client.address.street}</p>
                  <p>{client.address.city}, {client.address.state} {client.address.zipCode}</p>
                  <p>{client.address.country}</p>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              {client.emergencyContact.name && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{client.emergencyContact.name}</p>
                    <p className="text-sm text-muted-foreground">{client.emergencyContact.relationship}</p>
                    <p>{client.emergencyContact.phone}</p>
                  </CardContent>
                </Card>
              )}

              {/* Insurance Information */}
              {client.insurance?.provider && (
                <Card>
                  <CardHeader>
                    <CardTitle>Insurance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Provider</p>
                      <p className="font-medium">{client.insurance.provider}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Policy Number</p>
                      <p className="font-medium">{client.insurance.policyNumber}</p>
                    </div>
                    {client.insurance.groupNumber && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Group Number</p>
                        <p className="font-medium">{client.insurance.groupNumber}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="font-medium text-lg">{formatCurrency(client.totalSpent)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Prescriptions</p>
                    <p className="font-medium">{client.prescriptionHistory.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Visits</p>
                    <p className="font-medium">{client.clientHistory.length}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {client.tags.length > 0 && (
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {client.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Exam Dates */}
                {(client.medicalInfo.lastExamDate || client.medicalInfo.nextAppointment) && (
                  <div className="grid grid-cols-2 gap-4">
                    {client.medicalInfo.lastExamDate && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Last Eye Exam</p>
                        <p className="font-medium">{formatDate(client.medicalInfo.lastExamDate)}</p>
                      </div>
                    )}
                    {client.medicalInfo.nextAppointment && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Next Appointment</p>
                        <p className="font-medium">{formatDate(client.medicalInfo.nextAppointment)}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Allergies */}
                {client.medicalInfo.allergies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-destructive">Allergies</h4>
                    <div className="flex flex-wrap gap-2">
                      {client.medicalInfo.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medications */}
                {client.medicalInfo.medications.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Current Medications</h4>
                    <div className="flex flex-wrap gap-2">
                      {client.medicalInfo.medications.map((medication, index) => (
                        <Badge key={index} variant="secondary">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditions */}
                {client.medicalInfo.conditions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Medical Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {client.medicalInfo.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical Notes */}
                {client.medicalInfo.notes && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Medical Notes</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{client.medicalInfo.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <PrescriptionHistory 
              prescriptions={client.prescriptionHistory}
              clientId={client.id}
              canEdit={canEdit}
            />
          </TabsContent>

          <TabsContent value="history">
            <ClientHistory 
              history={client.clientHistory}
              clientId={client.id}
              canEdit={canEdit}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};