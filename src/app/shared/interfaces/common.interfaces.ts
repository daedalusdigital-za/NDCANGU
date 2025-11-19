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
  id: number;
  saleId: number;
  inventoryItemId: number;
  inventoryItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: number;
  saleNumber: string;
  saleDate: string;
  customerId?: number;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  total: number;
  notes?: string;
  provinceId: number;
  provinceName: string;
  saleItems: SaleItem[];
  dateCreated: string;
  lastUpdated: string;
}

// SaleModel for POST/PUT requests
export interface SaleModel {
  id?: number; // Optional for POST, required for PUT
  saleNumber: string;
  saleDate: string;
  customerId?: number;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  total: number;
  notes?: string;
  provinceId: number;
  saleItems: SaleItemModel[];
}

// SaleItemModel for POST/PUT requests
export interface SaleItemModel {
  id?: number; // Optional for new items
  inventoryItemId: number;
  quantity: number;
  unitPrice: number;
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
