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
    // Removed hardcoded test data
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
