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

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  sku?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: SaleItem[];
  totalAmount: number;
  saleDate: Date;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Mobile Payment';
  status: 'Pending' | 'Completed' | 'Cancelled';
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesReport {
  id: string;
  title: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  totalSales: number;
  totalRevenue: number;
  topProducts: Product[];
  salesByStatus: {
    completed: number;
    pending: number;
    cancelled: number;
  };
  createdAt: Date;
}
