export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string[];
  token?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  medicalConditions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  id: string;
  patientId: string;
  testType: string;
  result: any;
  datePerformed: Date;
  notes?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  data: any;
  createdBy: string;
  createdAt: Date;
  type: 'statistical' | 'patient' | 'custom';
}
