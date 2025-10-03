import { Injectable } from '@angular/core';
import { completeSalesData } from './sales-data-import';

export interface OrderRecord {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  province: string;
  poNumber: string;
  itemDescription: string;
  qtyBackOrder: number;
  unitPrice: number;
  status: string;
  totalValue?: number;
}

export interface SalesRecord {
  institution: string;
  province: string;
  itemDescription: string;
  date: string;
  invoiceNumber: string;
  quantity: number;
  salesAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderDataService {

  private orderRecords: OrderRecord[] = [
    { orderNumber: 'ORD144962', orderDate: '2025/08/11', customerName: 'BHEKI MLANGENI DISTRICT HOSPITAL', province: 'Gauteng', poNumber: '4251261444', itemDescription: 'NDOH35016-GLUCOSE METER - BATTERY', qtyBackOrder: 50.00, unitPrice: 8.31, status: 'Not delivered' },
    { orderNumber: 'ORD146103', orderDate: '2025/09/10', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: '576670', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 37.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146111', orderDate: '2025/09/10', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: '576247', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 50.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD143635', orderDate: '2025/06/30', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: '300035', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 19667.00, unitPrice: 0.00, status: 'Not delivered' },
    { orderNumber: 'ORD146104', orderDate: '2025/09/10', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: '576472', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 156.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146134', orderDate: '2025/09/11', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'LE/25/121198', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 200.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146133', orderDate: '2025/09/11', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'LE/25/121187', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1200.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD144305', orderDate: '2025/07/22', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'LP/25/4767', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 13305.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD142728', orderDate: '2025/06/09', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'LP/25/3639', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 24000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD142261', orderDate: '2025/05/27', customerName: 'DEPARTMENT OF HEALTH MPUMALANGA', province: 'Mpumalanga', poNumber: 'MP/25/2931', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 10000.00, unitPrice: 44.84, status: 'Not delivered' },
    { orderNumber: 'ORD144043', orderDate: '2025/07/14', customerName: 'DR. GEORGE MUKHARI HOSPITAL', province: 'Gauteng', poNumber: '4251258434', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 3000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145865', orderDate: '2025/09/02', customerName: 'DR. YUSUF DADOO HOSPITAL', province: 'Gauteng', poNumber: '4251262728', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 100.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD145865', orderDate: '2025/09/02', customerName: 'DR. YUSUF DADOO HOSPITAL', province: 'Gauteng', poNumber: '4251262728', itemDescription: 'NDOH35016-GLUCOSE METER - BATTERY', qtyBackOrder: 120.00, unitPrice: 8.31, status: 'Not delivered' },
    { orderNumber: 'ORD145865', orderDate: '2025/09/02', customerName: 'DR. YUSUF DADOO HOSPITAL', province: 'Gauteng', poNumber: '4251262728', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 800.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145865', orderDate: '2025/09/02', customerName: 'DR. YUSUF DADOO HOSPITAL', province: 'Gauteng', poNumber: '4251262728', itemDescription: 'NDOH35018-GLOCOSE METER - QUALITY CONTROL SOLUTIONS', qtyBackOrder: 20.00, unitPrice: 27.72, status: 'Not delivered' },
    { orderNumber: 'ORD145864', orderDate: '2025/09/02', customerName: 'EKURHULENI HEALTH DISTRICT', province: 'Gauteng', poNumber: '4251267091', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 1000.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD145864', orderDate: '2025/09/02', customerName: 'EKURHULENI HEALTH DISTRICT', province: 'Gauteng', poNumber: '4251267091', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 6000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD144749', orderDate: '2025/08/04', customerName: 'FAR EAST RAND HOSPITAL', province: 'Gauteng', poNumber: '4251262985', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1500.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145519', orderDate: '2025/08/22', customerName: 'FS HEALTH THABO MOFUTSANYANA DISTRICT', province: 'Free State', poNumber: 'RE022467', itemDescription: 'NDOH35015-HEMOGLOBIN METER - SINGLE USE DISPOSABLE LANCET', qtyBackOrder: 1300.00, unitPrice: 0.56, status: 'Not delivered' },
    { orderNumber: 'ORD145638', orderDate: '2025/08/26', customerName: 'FS HEALTH THABO MOFUTSANYANA DISTRICT', province: 'Free State', poNumber: 'RE022468', itemDescription: 'NDOH35016-GLUCOSE METER - BATTERY', qtyBackOrder: 150.00, unitPrice: 13.86, status: 'Not delivered' },
    { orderNumber: 'ORD145518', orderDate: '2025/08/22', customerName: 'FS HEALTH THABO MOFUTSANYANA DISTRICT', province: 'Free State', poNumber: 'RE022459', itemDescription: 'NDOH35016-GLUCOSE METER - BATTERY', qtyBackOrder: 150.00, unitPrice: 8.31, status: 'Not delivered' },
    { orderNumber: 'ORD145638', orderDate: '2025/08/26', customerName: 'FS HEALTH THABO MOFUTSANYANA DISTRICT', province: 'Free State', poNumber: 'RE022468', itemDescription: 'NDOH35036-DUAL GLUCOSE & HBA1C - QUALITY CONTROL SOLUTION HBA1C', qtyBackOrder: 9.00, unitPrice: 166.29, status: 'Not delivered' },
    { orderNumber: 'ORD145663', orderDate: '2025/08/27', customerName: 'GAUTENG EMERGENCY SERVICES', province: 'Gauteng', poNumber: '4251265929', itemDescription: 'NDOH35019-MULTIPARAMETER - 50 KETONE TEST STRIPS VIAL', qtyBackOrder: 6000.00, unitPrice: 460.78, status: 'Not delivered' },
    { orderNumber: 'ORD143639', orderDate: '2025/06/30', customerName: 'GERMISTON HOSPITAL', province: 'Gauteng', poNumber: '4251254737', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1800.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD142912', orderDate: '2025/06/12', customerName: 'HEALTH TSHWANE REGION C', province: 'Gauteng', poNumber: '4251250123', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146013', orderDate: '2025/09/08', customerName: 'HEIDELBURG HOSPITAL', province: 'Gauteng', poNumber: '4251267105', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 500.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146012', orderDate: '2025/09/08', customerName: 'HEIDELBURG HOSPITAL', province: 'Gauteng', poNumber: '4251267106', itemDescription: 'NDOH35016-GLUCOSE METER - BATTERY', qtyBackOrder: 100.00, unitPrice: 8.31, status: 'Not delivered' },
    { orderNumber: 'ORD146013', orderDate: '2025/09/08', customerName: 'HEIDELBURG HOSPITAL', province: 'Gauteng', poNumber: '4251267105', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD144993', orderDate: '2025/08/11', customerName: 'HELEN JOSEPH HOSPITAL', province: 'Gauteng', poNumber: '4251264088', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 10000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD143087', orderDate: '2025/06/17', customerName: 'HILLBROW CHC', province: 'Gauteng', poNumber: '4251250674', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 7740.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146266', orderDate: '2025/09/15', customerName: 'KALAFONG HOSPITAL', province: 'Gauteng', poNumber: 'DEVICE RATIO', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 300.00, unitPrice: 0.00, status: 'Not delivered' },
    { orderNumber: 'ORD145490', orderDate: '2025/08/21', customerName: 'KALAFONG HOSPITAL', province: 'Gauteng', poNumber: '4251266601', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 6500.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145443', orderDate: '2025/08/21', customerName: 'MEDICAL SUPPLY DEPOT TRANSITO -IN', province: 'Gauteng', poNumber: '1549517', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 6000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145862', orderDate: '2025/09/02', customerName: 'MP HEALTH BERNICE SAMUEL HOSPITAL', province: 'Mpumalanga', poNumber: 'DH004961', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 20.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD145862', orderDate: '2025/09/02', customerName: 'MP HEALTH BERNICE SAMUEL HOSPITAL', province: 'Mpumalanga', poNumber: 'DH004961', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 250.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146243', orderDate: '2025/09/15', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1543850', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 800.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146267', orderDate: '2025/09/15', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1555308', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 400.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146269', orderDate: '2025/09/15', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1555311', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 200.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD145905', orderDate: '2025/09/03', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1549135', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 500.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146242', orderDate: '2025/09/15', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1543896', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 800.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146268', orderDate: '2025/09/15', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1555309', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 800.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146270', orderDate: '2025/09/15', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1555312', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 2000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146102', orderDate: '2025/09/10', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1534264', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 400.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146015', orderDate: '2025/09/08', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1552747', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1228.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145741', orderDate: '2025/08/29', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1545373', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1200.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145726', orderDate: '2025/08/28', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '438664', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 15000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145635', orderDate: '2025/08/26', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1540868', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 2000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145314', orderDate: '2025/08/18', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1523278', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 600.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145041', orderDate: '2025/08/12', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1521403', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 3000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145044', orderDate: '2025/08/12', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1507446', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 500.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146241', orderDate: '2025/09/15', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: '1549142', itemDescription: 'NDOH35034-HBA1C TEST STRIPS', qtyBackOrder: 5.00, unitPrice: 2028.26, status: 'Not delivered' },
    { orderNumber: 'ORD144324', orderDate: '2025/07/22', customerName: 'SEBOKENG HOSPITAL', province: 'Gauteng', poNumber: '4251257111', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 6000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD144380', orderDate: '2025/07/23', customerName: 'SOUTH RAND HOSPITAL', province: 'Gauteng', poNumber: '4251252670', itemDescription: 'NDOH35016-GLUCOSE METER - BATTERY', qtyBackOrder: 60.00, unitPrice: 8.31, status: 'Not delivered' },
    { orderNumber: 'ORD144380', orderDate: '2025/07/23', customerName: 'SOUTH RAND HOSPITAL', province: 'Gauteng', poNumber: '4251252670', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1400.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD145034', orderDate: '2025/08/12', customerName: 'STEVE BIKO ACADEMIC HOSPITAL', province: 'Gauteng', poNumber: '4251264162', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 800.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD143697', orderDate: '2025/07/02', customerName: 'TAMBO MEMORIAL HOSPITAL', province: 'Gauteng', poNumber: '4251254482', itemDescription: 'NDOH35016-GLUCOSE METER - BATTERY', qtyBackOrder: 1500.00, unitPrice: 8.31, status: 'Not delivered' },
    { orderNumber: 'ORD145550', orderDate: '2025/08/25', customerName: 'TAMBO MEMORIAL HOSPITAL', province: 'Gauteng', poNumber: '4251266531', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 500.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD143697', orderDate: '2025/07/02', customerName: 'TAMBO MEMORIAL HOSPITAL', province: 'Gauteng', poNumber: '4251254482', itemDescription: 'NDOH35018-GLOCOSE METER - QUALITY CONTROL SOLUTIONS', qtyBackOrder: 1350.00, unitPrice: 27.72, status: 'Not delivered' },
    { orderNumber: 'ORD145029', orderDate: '2025/08/12', customerName: 'TEMBISA HOSPITAL', province: 'Gauteng', poNumber: '4251257397', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1000.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD144960', orderDate: '2025/08/11', customerName: 'TSHWANE DISTRICT HOSPITAL', province: 'Gauteng', poNumber: '4251261030', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 1500.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146106', orderDate: '2025/09/10', customerName: 'WEST RAND HEALTH DISTRICT OFFICE', province: 'Gauteng', poNumber: '4251270031', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 418.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146106', orderDate: '2025/09/10', customerName: 'WEST RAND HEALTH DISTRICT OFFICE', province: 'Gauteng', poNumber: '4251270031', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 2470.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146108', orderDate: '2025/09/10', customerName: 'WESTONARIA SUB DISTRICT', province: 'Gauteng', poNumber: '4251269254', itemDescription: 'NDOH35004-GLUCOSE METER- BIO HERMES', qtyBackOrder: 146.00, unitPrice: 157.01, status: 'Not delivered' },
    { orderNumber: 'ORD146108', orderDate: '2025/09/10', customerName: 'WESTONARIA SUB DISTRICT', province: 'Gauteng', poNumber: '4251269254', itemDescription: 'NDOH35017-GLUCOSE TEST STRIPS', qtyBackOrder: 160.00, unitPrice: 51.57, status: 'Not delivered' },
    { orderNumber: 'ORD146108', orderDate: '2025/09/10', customerName: 'WESTONARIA SUB DISTRICT', province: 'Gauteng', poNumber: '4251269254', itemDescription: 'NDOH35018-GLOCOSE METER - QUALITY CONTROL SOLUTIONS', qtyBackOrder: 10.00, unitPrice: 27.72, status: 'Not delivered' },
    { orderNumber: 'ORD146107', orderDate: '2025/09/10', customerName: 'WESTONARIA SUB DISTRICT', province: 'Gauteng', poNumber: '4251269255', itemDescription: 'NDOH35036-DUAL GLUCOSE & HBA1C - QUALITY CONTROL SOLUTION HBA1C', qtyBackOrder: 10.00, unitPrice: 166.29, status: 'Not delivered' },
    
    // Additional delivery records from 2025
    { orderNumber: 'IN152428', orderDate: '2025/04/11', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 500, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN152427', orderDate: '2025/04/11', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 2400, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152563', orderDate: '2025/04/17', customerName: 'RK KHAN HOSPITAL', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 1400, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152615', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'DUAL GLUCOSE & HBA1C METER- BIOHERMES', qtyBackOrder: 1, unitPrice: 2500, status: 'Delivered' },
    { orderNumber: 'IN152621', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'DUAL GLUCOSE & HBA1C METER- BIOHERMES', qtyBackOrder: 1, unitPrice: 2500, status: 'Delivered' },
    { orderNumber: 'IN152610', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 2, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN152616', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 60, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN152619', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 420, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN152614', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 70, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152617', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 200, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152622', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 300, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152611', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'HBA1C TEST STRIPS', qtyBackOrder: 5, unitPrice: 150, status: 'Delivered' },
    { orderNumber: 'IN152613', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'HBA1C TEST STRIPS', qtyBackOrder: 3, unitPrice: 150, status: 'Delivered' },
    { orderNumber: 'IN152620', orderDate: '2025/04/22', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'HBA1C TEST STRIPS', qtyBackOrder: 1, unitPrice: 150, status: 'Delivered' },
    { orderNumber: 'IN152634', orderDate: '2025/04/23', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 700, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152635', orderDate: '2025/04/23', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 300, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152644', orderDate: '2025/04/23', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 1000, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152773', orderDate: '2025/05/05', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 300, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152831', orderDate: '2025/05/06', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 2600, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152898', orderDate: '2025/05/08', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 200, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN152899', orderDate: '2025/05/08', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'HBA1C TEST STRIPS', qtyBackOrder: 10, unitPrice: 150, status: 'Delivered' },
    { orderNumber: 'IN153152', orderDate: '2025/05/16', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 150, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN153185', orderDate: '2025/05/16', customerName: 'BLOEMFONTEIN MEDICAL DEPOT', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 20, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN153141', orderDate: '2025/05/16', customerName: 'NC HEALTH DR HARRY SURTIE HOSPITAL', province: 'Northern Cape', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 100, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN153457', orderDate: '2025/05/27', customerName: 'DEPARTMENT OF HEALTH MPUMALANGA', province: 'Mpumalanga', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 166, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN154160', orderDate: '2025/06/11', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 2000, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN154167', orderDate: '2025/06/11', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 10000, unitPrice: 25, status: 'Delivered' },
    { orderNumber: 'IN154817', orderDate: '2025/06/26', customerName: 'EDENVALE GENERAL HOSPITAL', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 20, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN154843', orderDate: '2025/06/26', customerName: 'SOUTH RAND HOSPITAL', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'HEMOGLOBIN METER - BATTERY', qtyBackOrder: 50, unitPrice: 45, status: 'Delivered' },
    { orderNumber: 'IN155119', orderDate: '2025/07/03', customerName: 'HEALTH TSHWANE REGION C', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'HEMOGLOBIN METER - BIO AID HB METER', qtyBackOrder: 100, unitPrice: 455.03, status: 'Delivered' },
    { orderNumber: 'IN155219', orderDate: '2025/07/04', customerName: 'FS HEALTH NATIONAL HOSPITAL', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 64, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN155263', orderDate: '2025/07/04', customerName: 'HILLBROW CHC', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 415, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN155215', orderDate: '2025/07/04', customerName: 'RAHIMA MOOSA MOTHER & CHILD HOSPITAL', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 150, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN156074', orderDate: '2025/07/25', customerName: 'BETHESDA HOSPITAL', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'HEMOGLOBIN METER - BIO AID HB METER', qtyBackOrder: 2, unitPrice: 455.03, status: 'Delivered' },
    { orderNumber: 'IN156409', orderDate: '2025/08/01', customerName: 'MP HEALTH WITBANK HOSPITAL', province: 'Mpumalanga', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 28, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN156504', orderDate: '2025/08/04', customerName: 'MP HEALTH LYDENBURG HOSPITAL', province: 'Mpumalanga', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 100, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN156572', orderDate: '2025/08/05', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 710, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN156529', orderDate: '2025/08/05', customerName: 'FS HEALTH NATIONAL HOSPITAL', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 100, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN156532', orderDate: '2025/08/05', customerName: 'FS HEALTH MOFUMAHADI MANAPO HOSPITAL', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 50, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN156576', orderDate: '2025/08/05', customerName: 'THELLE MOGOERANE HOSPITAL', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 100, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN157895', orderDate: '2025/09/01', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 2290, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN157897', orderDate: '2025/09/01', customerName: 'DEPARTMENT OF HEALTH LIMPOPO', province: 'Limpopo', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 1565, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN158172', orderDate: '2025/09/08', customerName: 'GAUTENG EMERGENCY SERVICES', province: 'Gauteng', poNumber: 'DELIVERY', itemDescription: 'MULTIPARAMETER - 50 KETONE TEST STRIPS VIAL', qtyBackOrder: 3000, unitPrice: 75, status: 'Delivered' },
    { orderNumber: 'IN158144', orderDate: '2025/09/08', customerName: 'BORELELO WELL-MED SURGERY', province: 'Free State', poNumber: 'DELIVERY', itemDescription: 'MULTIPARAMETER - TAIDOC', qtyBackOrder: 1, unitPrice: 3500, status: 'Delivered' },
    { orderNumber: 'IN158375', orderDate: '2025/09/11', customerName: 'DEPARTMENT OF HEALTH MPUMALANGA', province: 'Mpumalanga', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE METER- BIO HERMES', qtyBackOrder: 1400, unitPrice: 850, status: 'Delivered' },
    { orderNumber: 'IN158450', orderDate: '2025/09/13', customerName: 'PROVINCIAL PHARM SUPPLY DEPOT', province: 'Kwa-Zulu Natal', poNumber: 'DELIVERY', itemDescription: 'GLUCOSE TEST STRIPS', qtyBackOrder: 2000, unitPrice: 25, status: 'Delivered' }
  ];

  private salesRecords: SalesRecord[] = completeSalesData;

  constructor() {
    // Calculate total values for each order record
    this.orderRecords = this.orderRecords.map(order => ({
      ...order,
      totalValue: order.qtyBackOrder * order.unitPrice
    }));
  }

  /**
   * Get all order records
   */
  getAllOrderRecords(): OrderRecord[] {
    return this.orderRecords;
  }

  /**
   * Get order records filtered by province
   */
  getOrderRecordsByProvince(province: string): OrderRecord[] {
    return this.orderRecords.filter(record => record.province === province);
  }

  /**
   * Get order records filtered by customer name
   */
  getOrderRecordsByCustomer(customerName: string): OrderRecord[] {
    return this.orderRecords.filter(record => 
      record.customerName.toLowerCase().includes(customerName.toLowerCase())
    );
  }

  /**
   * Get order records filtered by status
   */
  getOrderRecordsByStatus(status: string): OrderRecord[] {
    return this.orderRecords.filter(record => record.status === status);
  }

  /**
   * Get order records filtered by item description
   */
  getOrderRecordsByItem(itemDescription: string): OrderRecord[] {
    return this.orderRecords.filter(record => 
      record.itemDescription.toLowerCase().includes(itemDescription.toLowerCase())
    );
  }

  /**
   * Get order statistics summary
   */
  getOrderStatistics(): any {
    const totalRecords = this.orderRecords.length;
    const totalValue = this.orderRecords.reduce((sum, record) => sum + (record.totalValue || 0), 0);
    const totalQuantity = this.orderRecords.reduce((sum, record) => sum + record.qtyBackOrder, 0);
    const uniqueProvinces = [...new Set(this.orderRecords.map(record => record.province))];
    const uniqueCustomers = [...new Set(this.orderRecords.map(record => record.customerName))];
    const uniqueItems = [...new Set(this.orderRecords.map(record => record.itemDescription))];
    
    const statusCounts = this.orderRecords.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const provinceCounts = this.orderRecords.reduce((acc, record) => {
      acc[record.province] = (acc[record.province] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return {
      totalRecords,
      totalValue,
      totalQuantity,
      statusCounts,
      provinceCounts,
      provinceCount: uniqueProvinces.length,
      customerCount: uniqueCustomers.length,
      itemTypeCount: uniqueItems.length,
      provinces: uniqueProvinces.sort(),
      customers: uniqueCustomers.sort(),
      itemTypes: uniqueItems.sort()
    };
  }

  /**
   * Get unique values for filter dropdowns
   */
  getUniqueProvinces(): string[] {
    return [...new Set(this.orderRecords.map(record => record.province))].sort();
  }

  getUniqueCustomers(): string[] {
    return [...new Set(this.orderRecords.map(record => record.customerName))].sort();
  }

  getUniqueStatuses(): string[] {
    return [...new Set(this.orderRecords.map(record => record.status))].sort();
  }

  /**
   * Export order data for Excel/CSV
   */
  exportOrderData(): any[] {
    return this.orderRecords.map(record => ({
      'Order Number': record.orderNumber,
      'Order Date': record.orderDate,
      'Customer Name': record.customerName,
      'Province': record.province,
      'PO Number': record.poNumber,
      'Item Description': record.itemDescription,
      'Qty Back Order': record.qtyBackOrder,
      'Unit Price': record.unitPrice,
      'Total Value': record.totalValue,
      'Status': record.status
    }));
  }

  /**
   * Search orders with multiple criteria
   */
  searchOrders(criteria: {
    searchTerm?: string;
    province?: string;
    status?: string;
    customerName?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): OrderRecord[] {
    return this.orderRecords.filter(record => {
      // Search term filter
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase();
        const matchesSearch = 
          record.orderNumber.toLowerCase().includes(searchLower) ||
          record.customerName.toLowerCase().includes(searchLower) ||
          record.itemDescription.toLowerCase().includes(searchLower) ||
          record.poNumber.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Province filter
      if (criteria.province && criteria.province !== 'All') {
        if (record.province !== criteria.province) return false;
      }

      // Status filter
      if (criteria.status && criteria.status !== 'All') {
        if (record.status !== criteria.status) return false;
      }

      // Customer filter
      if (criteria.customerName && criteria.customerName !== 'All') {
        if (record.customerName !== criteria.customerName) return false;
      }

      // Date range filter
      if (criteria.dateFrom || criteria.dateTo) {
        const orderDate = new Date(record.orderDate);
        if (criteria.dateFrom && orderDate < criteria.dateFrom) return false;
        if (criteria.dateTo && orderDate > criteria.dateTo) return false;
      }

      return true;
    });
  }

  // Sales Record Methods
  
  /**
   * Get all sales records
   */
  getAllSalesRecords(): SalesRecord[] {
    return [...this.salesRecords];
  }

  /**
   * Get unique institutions for filtering
   */
  getUniqueInstitutions(): string[] {
    return [...new Set(this.salesRecords.map(record => record.institution))].sort();
  }

  /**
   * Get unique provinces for sales filtering
   */
  getUniqueSalesProvinces(): string[] {
    return [...new Set(this.salesRecords.map(record => record.province))].sort();
  }

  /**
   * Get unique sales statuses
   */
  getUniqueSalesStatuses(): string[] {
    return [...new Set(this.salesRecords.map(record => record.status))].sort();
  }

  /**
   * Get unique product types for filtering
   */
  getUniqueProductTypes(): string[] {
    return [...new Set(this.salesRecords.map(record => record.itemDescription))].sort();
  }

  /**
   * Search sales records with multiple criteria
   */
  searchSalesRecords(criteria: {
    searchTerm?: string;
    province?: string;
    status?: string;
    institution?: string;
    productType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): SalesRecord[] {
    return this.salesRecords.filter(record => {
      // Search term filter
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase();
        const matchesSearch = 
          record.invoiceNumber.toLowerCase().includes(searchLower) ||
          record.institution.toLowerCase().includes(searchLower) ||
          record.itemDescription.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Province filter
      if (criteria.province && criteria.province !== 'All') {
        if (record.province !== criteria.province) return false;
      }

      // Status filter
      if (criteria.status && criteria.status !== 'All') {
        if (record.status !== criteria.status) return false;
      }

      // Institution filter
      if (criteria.institution && criteria.institution !== 'All') {
        if (record.institution !== criteria.institution) return false;
      }

      // Product type filter
      if (criteria.productType && criteria.productType !== 'All') {
        if (record.itemDescription !== criteria.productType) return false;
      }

      // Date range filter
      if (criteria.dateFrom || criteria.dateTo) {
        const salesDate = new Date(record.date);
        if (criteria.dateFrom && salesDate < criteria.dateFrom) return false;
        if (criteria.dateTo && salesDate > criteria.dateTo) return false;
      }

      return true;
    });
  }

  /**
   * Get sales analytics by province
   */
  getSalesByProvince(): { province: string; totalSales: number; quantity: number; count: number }[] {
    const provinceMap = new Map<string, { totalSales: number; quantity: number; count: number }>();
    
    this.salesRecords.forEach(record => {
      if (!provinceMap.has(record.province)) {
        provinceMap.set(record.province, { totalSales: 0, quantity: 0, count: 0 });
      }
      const current = provinceMap.get(record.province)!;
      current.totalSales += record.salesAmount;
      current.quantity += record.quantity;
      current.count += 1;
    });

    return Array.from(provinceMap.entries()).map(([province, data]) => ({
      province,
      ...data
    })).sort((a, b) => b.totalSales - a.totalSales);
  }

  /**
   * Get sales analytics by product type
   */
  getSalesByProduct(): { product: string; totalSales: number; quantity: number; count: number }[] {
    const productMap = new Map<string, { totalSales: number; quantity: number; count: number }>();
    
    this.salesRecords.forEach(record => {
      if (!productMap.has(record.itemDescription)) {
        productMap.set(record.itemDescription, { totalSales: 0, quantity: 0, count: 0 });
      }
      const current = productMap.get(record.itemDescription)!;
      current.totalSales += record.salesAmount;
      current.quantity += record.quantity;
      current.count += 1;
    });

    return Array.from(productMap.entries()).map(([product, data]) => ({
      product,
      ...data
    })).sort((a, b) => b.totalSales - a.totalSales);
  }

  /**
   * Get delivery status summary
   */
  getDeliveryStatusSummary(): { status: string; count: number; totalSales: number }[] {
    const statusMap = new Map<string, { count: number; totalSales: number }>();
    
    this.salesRecords.forEach(record => {
      if (!statusMap.has(record.status)) {
        statusMap.set(record.status, { count: 0, totalSales: 0 });
      }
      const current = statusMap.get(record.status)!;
      current.count += 1;
      current.totalSales += record.salesAmount;
    });

    return Array.from(statusMap.entries()).map(([status, data]) => ({
      status,
      ...data
    }));
  }

  /**
   * Export sales data for Excel/CSV
   */
  exportSalesData(): any[] {
    return this.salesRecords.map(record => ({
      'Institution': record.institution,
      'Province': record.province,
      'Item Description': record.itemDescription,
      'Date': record.date,
      'Invoice Number': record.invoiceNumber,
      'Quantity': record.quantity,
      'Sales Amount': record.salesAmount,
      'Status': record.status
    }));
  }

  /**
   * Get total sales amount
   */
  getTotalSalesAmount(): number {
    return this.salesRecords.reduce((total, record) => total + record.salesAmount, 0);
  }

  /**
   * Get total quantity sold
   */
  getTotalQuantitySold(): number {
    return this.salesRecords.reduce((total, record) => total + record.quantity, 0);
  }
}
