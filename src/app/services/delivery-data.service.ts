import { Injectable } from '@angular/core';

export interface DeliveryRecord {
  institutionName: string;
  province: string;
  itemDescription: string;
  date: string;
  invoiceNumber: string;
  quantity: number;
  status: string;
  comment: string;
}

export interface ProvinceDeliveryTotals {
  province: string;
  glucoseMeters: number;
  glucoseStrips: number;
  hba1cStrips: number;
  dualMeters: number;
  hbMeters: number;
  hbStrips: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryDataService {

  private deliveryRecords: DeliveryRecord[] = [
    // Free State deliveries
    { institutionName: 'Bloemfontein Medical Depot', province: 'Free State', itemDescription: 'Glucose Meter', date: '2024-01-15', invoiceNumber: 'INV-2024-001', quantity: 5000, status: 'Delivered', comment: 'Primary distribution center' },
    { institutionName: 'FS Health & Social Development', province: 'Free State', itemDescription: 'Glucose Meter', date: '2024-02-10', invoiceNumber: 'INV-2024-034', quantity: 3089, status: 'Delivered', comment: 'Provincial health facilities' },
    { institutionName: 'Bloemfontein Medical Depot', province: 'Free State', itemDescription: 'Glucose Test Strips', date: '2024-01-15', invoiceNumber: 'INV-2024-002', quantity: 10000, status: 'Delivered', comment: 'Bulk strips distribution' },
    { institutionName: 'FS Health & Social Development', province: 'Free State', itemDescription: 'Glucose Test Strips', date: '2024-02-10', invoiceNumber: 'INV-2024-035', quantity: 1760, status: 'Delivered', comment: 'Additional strips' },
    { institutionName: 'Bahlabani Pharmacy', province: 'Free State', itemDescription: 'HBA1C Test Strips', date: '2024-03-05', invoiceNumber: 'INV-2024-045', quantity: 1, status: 'Delivered', comment: 'Special order' },
    { institutionName: 'FS Health & Social Development', province: 'Free State', itemDescription: 'HB Meter', date: '2024-02-20', invoiceNumber: 'INV-2024-036', quantity: 63, status: 'Delivered', comment: 'Hemoglobin testing units' },
    { institutionName: 'FS Health & Social Development', province: 'Free State', itemDescription: 'HB Test Strips', date: '2024-02-20', invoiceNumber: 'INV-2024-037', quantity: 1103, status: 'Delivered', comment: 'HB testing supplies' },

    // Kwa-Zulu Natal deliveries
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'Glucose Meter', date: '2024-01-08', invoiceNumber: 'INV-2024-010', quantity: 15000, status: 'Delivered', comment: 'Major provincial distribution' },
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'Glucose Meter', date: '2024-02-15', invoiceNumber: 'INV-2024-025', quantity: 5437, status: 'Delivered', comment: 'Secondary distribution' },
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'Glucose Test Strips', date: '2024-01-08', invoiceNumber: 'INV-2024-011', quantity: 25000, status: 'Delivered', comment: 'Primary strips shipment' },
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'Glucose Test Strips', date: '2024-02-15', invoiceNumber: 'INV-2024-026', quantity: 13479, status: 'Delivered', comment: 'Additional strips' },
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'HBA1C Test Strips', date: '2024-01-20', invoiceNumber: 'INV-2024-012', quantity: 155, status: 'Delivered', comment: 'Specialty testing strips' },
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'Dual Glucose & HBA1C Meter', date: '2024-03-01', invoiceNumber: 'INV-2024-040', quantity: 7, status: 'Delivered', comment: 'Advanced dual function meters' },
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'HB Meter', date: '2024-02-05', invoiceNumber: 'INV-2024-020', quantity: 50, status: 'Delivered', comment: 'Hemoglobin testing' },
    { institutionName: 'Provincial Pharm Supply Depot', province: 'Kwa-Zulu Natal', itemDescription: 'HB Test Strips', date: '2024-02-05', invoiceNumber: 'INV-2024-021', quantity: 60, status: 'Delivered', comment: 'HB testing supplies' },

    // Gauteng deliveries
    { institutionName: 'Charlotte Maxeke Johannesburg Academic Hospital', province: 'Gauteng', itemDescription: 'Glucose Meter', date: '2024-01-12', invoiceNumber: 'INV-2024-015', quantity: 3500, status: 'Delivered', comment: 'Academic hospital distribution' },
    { institutionName: 'Chris Hani Baragwanath Academic Hospital', province: 'Gauteng', itemDescription: 'Glucose Meter', date: '2024-01-18', invoiceNumber: 'INV-2024-016', quantity: 4000, status: 'Delivered', comment: 'Large hospital complex' },
    { institutionName: 'Steve Biko Academic Hospital', province: 'Gauteng', itemDescription: 'Glucose Meter', date: '2024-02-08', invoiceNumber: 'INV-2024-030', quantity: 2166, status: 'Delivered', comment: 'Pretoria academic hospital' },
    { institutionName: 'Gauteng Health Department', province: 'Gauteng', itemDescription: 'Glucose Meter', date: '2024-02-25', invoiceNumber: 'INV-2024-038', quantity: 1500, status: 'Delivered', comment: 'Provincial health facilities' },
    { institutionName: 'Charlotte Maxeke Johannesburg Academic Hospital', province: 'Gauteng', itemDescription: 'Glucose Test Strips', date: '2024-01-12', invoiceNumber: 'INV-2024-017', quantity: 8000, status: 'Delivered', comment: 'Hospital strips supply' },
    { institutionName: 'Chris Hani Baragwanath Academic Hospital', province: 'Gauteng', itemDescription: 'Glucose Test Strips', date: '2024-01-18', invoiceNumber: 'INV-2024-018', quantity: 9000, status: 'Delivered', comment: 'Large hospital strips' },
    { institutionName: 'Steve Biko Academic Hospital', province: 'Gauteng', itemDescription: 'Glucose Test Strips', date: '2024-02-08', invoiceNumber: 'INV-2024-031', quantity: 3655, status: 'Delivered', comment: 'Pretoria strips supply' },
    { institutionName: 'Gauteng Health Department', province: 'Gauteng', itemDescription: 'Glucose Test Strips', date: '2024-02-25', invoiceNumber: 'INV-2024-039', quantity: 2000, status: 'Delivered', comment: 'Provincial strips distribution' },
    { institutionName: 'Gauteng Health Department', province: 'Gauteng', itemDescription: 'HB Meter', date: '2024-02-12', invoiceNumber: 'INV-2024-032', quantity: 637, status: 'Delivered', comment: 'Hemoglobin meters for clinics' },
    { institutionName: 'Gauteng Health Department', province: 'Gauteng', itemDescription: 'HB Test Strips', date: '2024-02-12', invoiceNumber: 'INV-2024-033', quantity: 1474, status: 'Delivered', comment: 'HB testing strips supply' },
    { institutionName: 'Gauteng Health Department', province: 'Gauteng', itemDescription: 'HBA1C Test Strips', date: '2024-03-10', invoiceNumber: 'INV-2024-046', quantity: 170, status: 'Delivered', comment: 'Specialty HBA1C strips' },

    // Limpopo deliveries
    { institutionName: 'Limpopo Department of Health', province: 'Limpopo', itemDescription: 'Glucose Meter', date: '2024-01-25', invoiceNumber: 'INV-2024-022', quantity: 3000, status: 'Delivered', comment: 'Provincial health distribution' },
    { institutionName: 'Polokwane Provincial Hospital', province: 'Limpopo', itemDescription: 'Glucose Meter', date: '2024-02-18', invoiceNumber: 'INV-2024-028', quantity: 2565, status: 'Delivered', comment: 'Provincial hospital supply' },
    { institutionName: 'Limpopo Department of Health', province: 'Limpopo', itemDescription: 'Glucose Test Strips', date: '2024-01-25', invoiceNumber: 'INV-2024-023', quantity: 15000, status: 'Delivered', comment: 'Large strips distribution' },
    { institutionName: 'Polokwane Provincial Hospital', province: 'Limpopo', itemDescription: 'Glucose Test Strips', date: '2024-02-18', invoiceNumber: 'INV-2024-029', quantity: 8300, status: 'Delivered', comment: 'Hospital strips supply' },

    // Mpumalanga deliveries
    { institutionName: 'Mpumalanga Department of Health', province: 'Mpumalanga', itemDescription: 'Glucose Meter', date: '2024-02-02', invoiceNumber: 'INV-2024-024', quantity: 2517, status: 'Delivered', comment: 'Provincial health facilities' },
    { institutionName: 'Mpumalanga Department of Health', province: 'Mpumalanga', itemDescription: 'Glucose Test Strips', date: '2024-02-02', invoiceNumber: 'INV-2024-027', quantity: 5000, status: 'Delivered', comment: 'Provincial strips supply' },
    { institutionName: 'Mpumalanga Department of Health', province: 'Mpumalanga', itemDescription: 'HBA1C Test Strips', date: '2024-03-08', invoiceNumber: 'INV-2024-044', quantity: 39, status: 'Delivered', comment: 'Specialty testing strips' },
    { institutionName: 'Mpumalanga Department of Health', province: 'Mpumalanga', itemDescription: 'HB Meter', date: '2024-02-22', invoiceNumber: 'INV-2024-041', quantity: 14, status: 'Delivered', comment: 'Hemoglobin testing units' },
    { institutionName: 'Mpumalanga Department of Health', province: 'Mpumalanga', itemDescription: 'HB Test Strips', date: '2024-02-22', invoiceNumber: 'INV-2024-042', quantity: 55, status: 'Delivered', comment: 'HB testing supplies' },

    // Northern Cape deliveries
    { institutionName: 'Northern Cape Department of Health', province: 'Northern Cape', itemDescription: 'Glucose Meter', date: '2024-03-12', invoiceNumber: 'INV-2024-047', quantity: 100, status: 'Delivered', comment: 'Small rural province allocation' },
    { institutionName: 'Northern Cape Department of Health', province: 'Northern Cape', itemDescription: 'Glucose Test Strips', date: '2024-03-12', invoiceNumber: 'INV-2024-048', quantity: 100, status: 'Delivered', comment: 'Rural clinic strips' },

    // Eastern Cape deliveries
    { institutionName: 'Eastern Cape Department of Health', province: 'Eastern Cape', itemDescription: 'Glucose Meter', date: '2024-03-15', invoiceNumber: 'INV-2024-049', quantity: 399, status: 'Delivered', comment: 'Provincial health facilities' },
    { institutionName: 'Eastern Cape Department of Health', province: 'Eastern Cape', itemDescription: 'Glucose Test Strips', date: '2024-03-15', invoiceNumber: 'INV-2024-050', quantity: 399, status: 'Delivered', comment: 'Matching strips supply' }
  ];

  constructor() { }

  /**
   * Get all delivery records
   */
  getAllDeliveryRecords(): DeliveryRecord[] {
    return this.deliveryRecords;
  }

  /**
   * Get delivery totals by province
   */
  getProvinceDeliveryTotals(): ProvinceDeliveryTotals[] {
    const provinces = ['Kwa-Zulu Natal', 'Gauteng', 'Free State', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'Northern Cape'];
    
    return provinces.map(province => {
      const provinceRecords = this.deliveryRecords.filter(record => record.province === province);
      
      const totals: ProvinceDeliveryTotals = {
        province: province,
        glucoseMeters: this.sumQuantityByItem(provinceRecords, 'Glucose Meter'),
        glucoseStrips: this.sumQuantityByItem(provinceRecords, 'Glucose Test Strips'),
        hba1cStrips: this.sumQuantityByItem(provinceRecords, 'HBA1C Test Strips'),
        dualMeters: this.sumQuantityByItem(provinceRecords, 'Dual Glucose & HBA1C Meter'),
        hbMeters: this.sumQuantityByItem(provinceRecords, 'HB Meter'),
        hbStrips: this.sumQuantityByItem(provinceRecords, 'HB Test Strips'),
        totalItems: 0
      };

      totals.totalItems = totals.glucoseMeters + totals.glucoseStrips + totals.hba1cStrips + 
                         totals.dualMeters + totals.hbMeters + totals.hbStrips;

      return totals;
    });
  }

  /**
   * Get chart data for the Total Stock Delivered by Province chart
   */
  getChartDataByProvince(): any {
    const provinceOrder = ['KZN', 'GP', 'FS', 'EC', 'LP', 'MPU', 'NC'];
    const provinceMapping: { [key: string]: string } = {
      'Kwa-Zulu Natal': 'KZN',
      'Gauteng': 'GP',
      'Free State': 'FS',
      'Eastern Cape': 'EC',
      'Limpopo': 'LP',
      'Mpumalanga': 'MPU',
      'Northern Cape': 'NC'
    };

    const totals = this.getProvinceDeliveryTotals();
    
    return {
      hbMeter: provinceOrder.map(abbrev => {
        const province = Object.keys(provinceMapping).find(key => provinceMapping[key] === abbrev);
        const provinceTotal = totals.find(t => t.province === province);
        return provinceTotal ? provinceTotal.hbMeters : 0;
      }),
      hbStrips: provinceOrder.map(abbrev => {
        const province = Object.keys(provinceMapping).find(key => provinceMapping[key] === abbrev);
        const provinceTotal = totals.find(t => t.province === province);
        return provinceTotal ? provinceTotal.hbStrips : 0;
      }),
      glucoseMeter: provinceOrder.map(abbrev => {
        const province = Object.keys(provinceMapping).find(key => provinceMapping[key] === abbrev);
        const provinceTotal = totals.find(t => t.province === province);
        return provinceTotal ? provinceTotal.glucoseMeters : 0;
      }),
      glucoseStrips: provinceOrder.map(abbrev => {
        const province = Object.keys(provinceMapping).find(key => provinceMapping[key] === abbrev);
        const provinceTotal = totals.find(t => t.province === province);
        return provinceTotal ? provinceTotal.glucoseStrips : 0;
      }),
      hba1cMeter: provinceOrder.map(abbrev => {
        const province = Object.keys(provinceMapping).find(key => provinceMapping[key] === abbrev);
        const provinceTotal = totals.find(t => t.province === province);
        return provinceTotal ? provinceTotal.dualMeters : 0;
      }),
      hba1cStrips: provinceOrder.map(abbrev => {
        const province = Object.keys(provinceMapping).find(key => provinceMapping[key] === abbrev);
        const provinceTotal = totals.find(t => t.province === province);
        return provinceTotal ? provinceTotal.hba1cStrips : 0;
      })
    };
  }

  /**
   * Get delivery records filtered by province
   */
  getDeliveryRecordsByProvince(province: string): DeliveryRecord[] {
    return this.deliveryRecords.filter(record => record.province === province);
  }

  /**
   * Get delivery records filtered by item type
   */
  getDeliveryRecordsByItem(itemDescription: string): DeliveryRecord[] {
    return this.deliveryRecords.filter(record => record.itemDescription === itemDescription);
  }

  /**
   * Get delivery statistics summary
   */
  getDeliveryStatistics(): any {
    const totalRecords = this.deliveryRecords.length;
    const totalQuantity = this.deliveryRecords.reduce((sum, record) => sum + record.quantity, 0);
    const uniqueProvinces = [...new Set(this.deliveryRecords.map(record => record.province))];
    const uniqueItems = [...new Set(this.deliveryRecords.map(record => record.itemDescription))];
    const deliveredRecords = this.deliveryRecords.filter(record => record.status === 'Delivered');
    
    return {
      totalRecords,
      totalQuantity,
      totalDelivered: deliveredRecords.reduce((sum, record) => sum + record.quantity, 0),
      deliveryRate: Math.round((deliveredRecords.length / totalRecords) * 100),
      provinceCount: uniqueProvinces.length,
      itemTypeCount: uniqueItems.length,
      provinces: uniqueProvinces,
      itemTypes: uniqueItems
    };
  }

  /**
   * Helper method to sum quantities by item description
   */
  private sumQuantityByItem(records: DeliveryRecord[], itemDescription: string): number {
    return records
      .filter(record => record.itemDescription === itemDescription && record.status === 'Delivered')
      .reduce((sum, record) => sum + record.quantity, 0);
  }

  /**
   * Export delivery data for Excel/CSV
   */
  exportDeliveryData(): any[] {
    return this.deliveryRecords.map(record => ({
      'Institution Name': record.institutionName,
      'Province': record.province,
      'Item Description': record.itemDescription,
      'Delivery Date': record.date,
      'Invoice Number': record.invoiceNumber,
      'Quantity': record.quantity,
      'Status': record.status,
      'Comments': record.comment
    }));
  }
}
