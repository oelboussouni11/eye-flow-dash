import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client, OpticalInfo } from '@/types/client';
import { useAuth } from '@/contexts/AuthContext';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  client?: Client | null;
  storeId?: string;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client,
  storeId
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
    insurance: {
      provider: string;
      policyNumber: string;
      groupNumber: string;
    };
    opticalInfo?: OpticalInfo;
    tags: string[];
    status: 'active' | 'inactive';
    preferredContactMethod: 'email' | 'phone' | 'sms';
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: ''
    },
    opticalInfo: {
      notes: '',
      lastExamDate: '',
      nextAppointment: ''
    },
    tags: [] as string[],
    status: 'active',
    preferredContactMethod: 'email'
  });

  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        dateOfBirth: client.dateOfBirth,
        address: { ...client.address },
        emergencyContact: { ...client.emergencyContact },
        insurance: client.insurance ? { ...client.insurance, groupNumber: client.insurance.groupNumber || '' } : { provider: '', policyNumber: '', groupNumber: '' },
        opticalInfo: client.opticalInfo ? {
          currentPrescription: client.opticalInfo.currentPrescription ? {
            ...client.opticalInfo.currentPrescription,
            rightEye: client.opticalInfo.currentPrescription.rightEye ? {
              ...client.opticalInfo.currentPrescription.rightEye
            } : undefined,
            leftEye: client.opticalInfo.currentPrescription.leftEye ? {
              ...client.opticalInfo.currentPrescription.leftEye
            } : undefined
          } : undefined,
          visualAcuity: client.opticalInfo.visualAcuity ? {
            ...client.opticalInfo.visualAcuity
          } : undefined,
          intraocularPressure: client.opticalInfo.intraocularPressure ? {
            ...client.opticalInfo.intraocularPressure
          } : undefined,
          notes: client.opticalInfo.notes || '',
          lastExamDate: client.opticalInfo.lastExamDate || '',
          nextAppointment: client.opticalInfo.nextAppointment || ''
        } : {
          notes: '',
          lastExamDate: '',
          nextAppointment: ''
        },
        tags: [...client.tags],
        status: client.status,
        preferredContactMethod: client.preferredContactMethod
      });
    } else {
      // Reset form for new client
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        insurance: {
          provider: '',
          policyNumber: '',
          groupNumber: ''
        },
        opticalInfo: {
          notes: '',
          lastExamDate: '',
          nextAppointment: ''
        },
        tags: [],
        status: 'active',
        preferredContactMethod: 'email'
      });
    }
  }, [client, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const fieldParts = field.split('.');
      setFormData(prev => {
        const updated = { ...prev };
        
        // Handle nested optical info creation
        if (fieldParts[0] === 'opticalInfo' && !updated.opticalInfo) {
          updated.opticalInfo = {};
        }
        
        // Navigate to the nested object and create intermediate objects if needed
        let current: any = updated;
        for (let i = 0; i < fieldParts.length - 1; i++) {
          const part = fieldParts[i];
          if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
          } else {
            current[part] = { ...current[part] };
          }
          current = current[part];
        }
        
        // Set the final value
        const finalField = fieldParts[fieldParts.length - 1];
        current[finalField] = value;
        
        return updated;
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addItem = (type: 'tags', value: string) => {
    if (!value.trim()) return;

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, value.trim()]
    }));
    setNewTag('');
  };

  const removeItem = (type: 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
        prescriptionHistory: client?.prescriptionHistory || [],
        clientHistory: client?.clientHistory || [],
        ownerId: user?.id || '',
        storeId: storeId || client?.storeId,
        totalSpent: client?.totalSpent || 0,
        lastVisit: client?.lastVisit
      };

      onSubmit(clientData);
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact & Address</TabsTrigger>
              <TabsTrigger value="optical">Optical Info</TabsTrigger>
              <TabsTrigger value="other">Other Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredContactMethod">Preferred Contact</Label>
                    <Select
                      value={formData.preferredContactMethod}
                      onValueChange={(value) => handleInputChange('preferredContactMethod', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.address.zipCode}
                        onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insurance Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input
                      id="provider"
                      value={formData.insurance.provider}
                      onChange={(e) => handleInputChange('insurance.provider', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      value={formData.insurance.policyNumber}
                      onChange={(e) => handleInputChange('insurance.policyNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupNumber">Group Number</Label>
                    <Input
                      id="groupNumber"
                      value={formData.insurance.groupNumber}
                      onChange={(e) => handleInputChange('insurance.groupNumber', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Prescription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Prescription */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Right Eye (OD) */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-center">Right Eye (OD)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Sphere (SPH)</Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={formData.opticalInfo?.currentPrescription?.rightEye?.sphere || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.rightEye.sphere', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cylinder (CYL)</Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={formData.opticalInfo?.currentPrescription?.rightEye?.cylinder || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.rightEye.cylinder', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Axis</Label>
                          <Input
                            type="number"
                            min="0"
                            max="180"
                            value={formData.opticalInfo?.currentPrescription?.rightEye?.axis || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.rightEye.axis', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Add</Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={formData.opticalInfo?.currentPrescription?.rightEye?.add || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.rightEye.add', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Left Eye (OS) */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-center">Left Eye (OS)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Sphere (SPH)</Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={formData.opticalInfo?.currentPrescription?.leftEye?.sphere || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.leftEye.sphere', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cylinder (CYL)</Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={formData.opticalInfo?.currentPrescription?.leftEye?.cylinder || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.leftEye.cylinder', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Axis</Label>
                          <Input
                            type="number"
                            min="0"
                            max="180"
                            value={formData.opticalInfo?.currentPrescription?.leftEye?.axis || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.leftEye.axis', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Add</Label>
                          <Input
                            type="number"
                            step="0.25"
                            value={formData.opticalInfo?.currentPrescription?.leftEye?.add || ''}
                            onChange={(e) => handleInputChange('opticalInfo.currentPrescription.leftEye.add', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PD and Doctor Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Pupillary Distance (PD)</Label>
                      <Input
                        type="number"
                        value={formData.opticalInfo?.currentPrescription?.pd || ''}
                        onChange={(e) => handleInputChange('opticalInfo.currentPrescription.pd', parseFloat(e.target.value) || 0)}
                        placeholder="62"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prescribed By</Label>
                      <Input
                        value={formData.opticalInfo?.currentPrescription?.prescribedBy || ''}
                        onChange={(e) => handleInputChange('opticalInfo.currentPrescription.prescribedBy', e.target.value)}
                        placeholder="Dr. Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prescription Date</Label>
                      <Input
                        type="date"
                        value={formData.opticalInfo?.currentPrescription?.prescriptionDate || ''}
                        onChange={(e) => handleInputChange('opticalInfo.currentPrescription.prescriptionDate', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visual Acuity</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Uncorrected</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Right Eye (OD)</Label>
                        <Input
                          value={formData.opticalInfo?.visualAcuity?.rightEyeUncorrected || ''}
                          onChange={(e) => handleInputChange('opticalInfo.visualAcuity.rightEyeUncorrected', e.target.value)}
                          placeholder="20/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Left Eye (OS)</Label>
                        <Input
                          value={formData.opticalInfo?.visualAcuity?.leftEyeUncorrected || ''}
                          onChange={(e) => handleInputChange('opticalInfo.visualAcuity.leftEyeUncorrected', e.target.value)}
                          placeholder="20/20"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Corrected</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Right Eye (OD)</Label>
                        <Input
                          value={formData.opticalInfo?.visualAcuity?.rightEyeCorrected || ''}
                          onChange={(e) => handleInputChange('opticalInfo.visualAcuity.rightEyeCorrected', e.target.value)}
                          placeholder="20/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Left Eye (OS)</Label>
                        <Input
                          value={formData.opticalInfo?.visualAcuity?.leftEyeCorrected || ''}
                          onChange={(e) => handleInputChange('opticalInfo.visualAcuity.leftEyeCorrected', e.target.value)}
                          placeholder="20/20"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intraocular Pressure (IOP)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Right Eye (mmHg)</Label>
                      <Input
                        type="number"
                        value={formData.opticalInfo?.intraocularPressure?.rightEye || ''}
                        onChange={(e) => handleInputChange('opticalInfo.intraocularPressure.rightEye', parseFloat(e.target.value) || 0)}
                        placeholder="15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Left Eye (mmHg)</Label>
                      <Input
                        type="number"
                        value={formData.opticalInfo?.intraocularPressure?.leftEye || ''}
                        onChange={(e) => handleInputChange('opticalInfo.intraocularPressure.leftEye', parseFloat(e.target.value) || 0)}
                        placeholder="15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Test Date</Label>
                      <Input
                        type="date"
                        value={formData.opticalInfo?.intraocularPressure?.testDate || ''}
                        onChange={(e) => handleInputChange('opticalInfo.intraocularPressure.testDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Last Eye Exam</Label>
                      <Input
                        type="date"
                        value={formData.opticalInfo?.lastExamDate || ''}
                        onChange={(e) => handleInputChange('opticalInfo.lastExamDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Next Appointment</Label>
                      <Input
                        type="date"
                        value={formData.opticalInfo?.nextAppointment || ''}
                        onChange={(e) => handleInputChange('opticalInfo.nextAppointment', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Optical Notes</Label>
                    <Textarea
                      value={formData.opticalInfo?.notes || ''}
                      onChange={(e) => handleInputChange('opticalInfo.notes', e.target.value)}
                      rows={3}
                      placeholder="Additional optical notes..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tags', newTag))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('tags', newTag)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeItem('tags', index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : client ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};