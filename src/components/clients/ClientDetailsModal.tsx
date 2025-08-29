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
            <TabsTrigger value="optical">Optical Info</TabsTrigger>
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

          <TabsContent value="optical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Prescription */}
                {client.opticalInfo?.currentPrescription && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Current Prescription</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium text-center">Right Eye (OD)</h5>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">SPH:</span>
                            <span className="font-mono">{client.opticalInfo.currentPrescription.rightEye?.sphere || '0.00'}</span>
                            <span className="text-muted-foreground">CYL:</span>
                            <span className="font-mono">{client.opticalInfo.currentPrescription.rightEye?.cylinder || '0.00'}</span>
                            <span className="text-muted-foreground">AXIS:</span>
                            <span className="font-mono">{client.opticalInfo.currentPrescription.rightEye?.axis || '0'}°</span>
                            {client.opticalInfo.currentPrescription.rightEye?.add && (
                              <>
                                <span className="text-muted-foreground">ADD:</span>
                                <span className="font-mono">{client.opticalInfo.currentPrescription.rightEye.add}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium text-center">Left Eye (OS)</h5>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">SPH:</span>
                            <span className="font-mono">{client.opticalInfo.currentPrescription.leftEye?.sphere || '0.00'}</span>
                            <span className="text-muted-foreground">CYL:</span>
                            <span className="font-mono">{client.opticalInfo.currentPrescription.leftEye?.cylinder || '0.00'}</span>
                            <span className="text-muted-foreground">AXIS:</span>
                            <span className="font-mono">{client.opticalInfo.currentPrescription.leftEye?.axis || '0'}°</span>
                            {client.opticalInfo.currentPrescription.leftEye?.add && (
                              <>
                                <span className="text-muted-foreground">ADD:</span>
                                <span className="font-mono">{client.opticalInfo.currentPrescription.leftEye.add}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {client.opticalInfo.currentPrescription.pd && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Pupillary Distance (PD)</p>
                          <p className="font-medium">{client.opticalInfo.currentPrescription.pd}mm</p>
                        </div>
                      )}
                      {client.opticalInfo.currentPrescription.prescribedBy && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Prescribed By</p>
                          <p className="font-medium">{client.opticalInfo.currentPrescription.prescribedBy}</p>
                        </div>
                      )}
                      {client.opticalInfo.currentPrescription.prescriptionDate && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Prescription Date</p>
                          <p className="font-medium">{formatDate(client.opticalInfo.currentPrescription.prescriptionDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Visual Acuity */}
                {client.opticalInfo?.visualAcuity && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Visual Acuity</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium">Uncorrected</h5>
                        <div className="space-y-2">
                          {client.opticalInfo.visualAcuity.rightEyeUncorrected && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">OD:</span>
                              <span className="font-medium">{client.opticalInfo.visualAcuity.rightEyeUncorrected}</span>
                            </div>
                          )}
                          {client.opticalInfo.visualAcuity.leftEyeUncorrected && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">OS:</span>
                              <span className="font-medium">{client.opticalInfo.visualAcuity.leftEyeUncorrected}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium">Corrected</h5>
                        <div className="space-y-2">
                          {client.opticalInfo.visualAcuity.rightEyeCorrected && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">OD:</span>
                              <span className="font-medium">{client.opticalInfo.visualAcuity.rightEyeCorrected}</span>
                            </div>
                          )}
                          {client.opticalInfo.visualAcuity.leftEyeCorrected && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">OS:</span>
                              <span className="font-medium">{client.opticalInfo.visualAcuity.leftEyeCorrected}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Intraocular Pressure */}
                {client.opticalInfo?.intraocularPressure && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Intraocular Pressure (IOP)</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {client.opticalInfo.intraocularPressure.rightEye && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Right Eye (OD)</p>
                          <p className="font-medium">{client.opticalInfo.intraocularPressure.rightEye} mmHg</p>
                        </div>
                      )}
                      {client.opticalInfo.intraocularPressure.leftEye && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Left Eye (OS)</p>
                          <p className="font-medium">{client.opticalInfo.intraocularPressure.leftEye} mmHg</p>
                        </div>
                      )}
                      {client.opticalInfo.intraocularPressure.testDate && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Test Date</p>
                          <p className="font-medium">{formatDate(client.opticalInfo.intraocularPressure.testDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Exam Dates */}
                {(client.opticalInfo?.lastExamDate || client.opticalInfo?.nextAppointment) && (
                  <div className="grid grid-cols-2 gap-4">
                    {client.opticalInfo.lastExamDate && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Last Eye Exam</p>
                        <p className="font-medium">{formatDate(client.opticalInfo.lastExamDate)}</p>
                      </div>
                    )}
                    {client.opticalInfo.nextAppointment && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Next Appointment</p>
                        <p className="font-medium">{formatDate(client.opticalInfo.nextAppointment)}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Optical Notes */}
                {client.opticalInfo?.notes && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Optical Notes</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{client.opticalInfo.notes}</p>
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