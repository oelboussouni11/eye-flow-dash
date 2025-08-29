export interface MedicalInfo {
  allergies: string[];
  medications: string[];
  conditions: string[];
  notes?: string;
  lastExamDate?: string;
  nextAppointment?: string;
}

export interface PrescriptionHistory {
  id: string;
  date: string;
  type: 'glasses' | 'contact_lenses' | 'sunglasses';
  rightEye: {
    sphere: number;
    cylinder: number;
    axis: number;
    add?: number;
  };
  leftEye: {
    sphere: number;
    cylinder: number;
    axis: number;
    add?: number;
  };
  pd: number; // Pupillary Distance
  frame?: string;
  lensType?: string;
  coating?: string;
  notes?: string;
  doctorName?: string;
  cost: number;
  storeId: string;
}

export interface ClientHistory {
  id: string;
  date: string;
  type: 'visit' | 'purchase' | 'follow_up' | 'complaint' | 'prescription';
  description: string;
  employeeId?: string;
  employeeName?: string;
  amount?: number;
  storeId: string;
}

export interface Client {
  id: string;
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
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  medicalInfo: MedicalInfo;
  prescriptionHistory: PrescriptionHistory[];
  clientHistory: ClientHistory[];
  createdAt: string;
  updatedAt: string;
  storeId?: string;
  ownerId: string;
  tags: string[];
  status: 'active' | 'inactive';
  preferredContactMethod: 'email' | 'phone' | 'sms';
  totalSpent: number;
  lastVisit?: string;
}