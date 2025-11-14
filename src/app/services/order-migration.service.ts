/**
 * MIGRATION SCRIPT: Medical Equipment Orders to Sales Database
 *
 * Purpose: Convert 112 hardcoded order records into Sales records via API
 *
 * This script will:
 * 1. Read all 112 hardcoded order records from order-data.service.ts
 * 2. Transform them into Sale format matching API specification
 * 3. Post each sale to POST /api/Sales/Add endpoint
 * 4. Log success/failure for each record
 * 5. Generate migration report
 *
 * Run this script ONCE to populate the database with historical orders
 */

import { Injectable } from '@angular/core';
import { DatabaseService } from '../services/data/database.service';
import { OrderDataService, OrderRecord } from '../services/order-data.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface MigrationResult {
  success: boolean;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  errors: Array<{ orderNumber: string; error: string }>;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderMigrationService {

  constructor(
    private databaseService: DatabaseService,
    private orderDataService: OrderDataService
  ) {}

  /**
   * Convert OrderRecord to Sale format
   * Maps order fields to sale fields as per API specification
   */
  private convertOrderToSale(order: OrderRecord, index: number): any {
    const saleDate = this.parseDate(order.orderDate);

    return {
      // Generate unique sale number from order number
      saleNumber: order.orderNumber,

      // Convert date format from "2025/08/11" to ISO "2025-08-11T00:00:00Z"
      saleDate: saleDate,

      // Location information
      province: order.province,
      hospital: order.customerName,

      // Customer contact (extract from institution name or use default)
      customerContactName: this.extractContactName(order.customerName),
      customerContactEmail: this.generateEmail(order.customerName),
      customerContactPhone: '', // Not available in order data

      // Payment information
      // 0=Cash, 1=Card, 2=EFT, 3=Invoice
      paymentMethod: 3, // Assume Invoice for government orders

      // Payment status
      // 0=Pending, 1=Paid, 2=PartiallyPaid, 3=Refunded
      paymentStatus: order.status === 'Not delivered' ? 0 : 1,

      // Delivery status
      // 0=Pending, 1=Processing, 2=Shipped, 3=Delivered, 4=Cancelled
      deliveryStatus: order.status === 'Not delivered' ? 0 : 3,

      // Delivery date (null if not delivered)
      deliveryDate: order.status === 'Not delivered' ? null : this.estimateDeliveryDate(saleDate),

      // Additional information
      notes: `PO Number: ${order.poNumber}. Original Status: ${order.status}`,
      salesPerson: 'System Migration',
      discount: 0,
      invoiceNumber: order.poNumber, // Use PO number as invoice reference

      // Sale items (single item per order in this dataset)
      saleItems: [
        {
          productId: index + 1, // Temporary ID, should map to actual product
          productName: order.itemDescription,
          quantity: order.qtyBackOrder,
          unitPrice: order.unitPrice
        }
      ]
    };
  }

  /**
   * Parse date from "2025/08/11" format to ISO format
   */
  private parseDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('/');
    return `${year}-${month}-${day}T00:00:00Z`;
  }

  /**
   * Extract contact name from institution name
   * E.g., "BHEKI MLANGENI DISTRICT HOSPITAL" -> "Hospital Administrator"
   */
  private extractContactName(institutionName: string): string {
    if (institutionName.includes('HOSPITAL')) {
      return 'Hospital Administrator';
    } else if (institutionName.includes('DEPOT')) {
      return 'Depot Manager';
    } else if (institutionName.includes('DISTRICT')) {
      return 'District Manager';
    } else if (institutionName.includes('DEPARTMENT')) {
      return 'Department Head';
    }
    return 'Procurement Officer';
  }

  /**
   * Generate email from institution name
   */
  private generateEmail(institutionName: string): string {
    const name = institutionName.toLowerCase()
      .replace(/[^a-z0-9\\s]/g, '')
      .trim()
      .split(' ')
      .slice(0, 2)
      .join('.');
    return `${name}@health.gov.za`;
  }

  /**
   * Estimate delivery date (30 days after order date for delivered items)
   */
  private estimateDeliveryDate(saleDate: string): string {
    const date = new Date(saleDate);
    date.setDate(date.getDate() + 30);
    return date.toISOString();
  }

  /**
   * Migrate all order records to sales database
   * Returns Observable with migration results
   */
  migrateAllOrders(): Observable<MigrationResult> {
    const startTime = Date.now();
    const orders = this.orderDataService.getAllOrderRecords();

    console.log(`🚀 Starting migration of ${orders.length} order records...`);

    const migrationRequests = orders.map((order, index) => {
      const sale = this.convertOrderToSale(order, index);

      return this.databaseService.createSale(sale).pipe(
        map(() => ({ success: true, orderNumber: order.orderNumber })),
        catchError(error => {
          console.error(`❌ Failed to migrate order ${order.orderNumber}:`, error);
          return of({
            success: false,
            orderNumber: order.orderNumber,
            error: error.message || 'Unknown error'
          });
        })
      );
    });

    return forkJoin(migrationRequests).pipe(
      map(results => {
        const duration = Date.now() - startTime;
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        const errors = results
          .filter(r => !r.success)
          .map(r => ({
            orderNumber: r.orderNumber,
            error: (r as any).error
          }));

        const result: MigrationResult = {
          success: failureCount === 0,
          totalRecords: orders.length,
          successCount,
          failureCount,
          errors,
          duration
        };

        this.logMigrationResults(result);
        return result;
      })
    );
  }

  /**
   * Migrate a single order record (for testing)
   */
  migrateSingleOrder(orderNumber: string): Observable<any> {
    const orders = this.orderDataService.getAllOrderRecords();
    const order = orders.find(o => o.orderNumber === orderNumber);

    if (!order) {
      return of({ success: false, error: 'Order not found' });
    }

    const sale = this.convertOrderToSale(order, 0);

    return this.databaseService.createSale(sale).pipe(
      map(() => ({
        success: true,
        orderNumber: order.orderNumber,
        message: 'Order migrated successfully'
      })),
      catchError(error => of({
        success: false,
        orderNumber: order.orderNumber,
        error: error.message
      }))
    );
  }

  /**
   * Log migration results to console
   */
  private logMigrationResults(result: MigrationResult): void {
    console.log('\\n' + '='.repeat(60));
    console.log('📊 MIGRATION REPORT');
    console.log('='.repeat(60));
    console.log(`Total Records:    ${result.totalRecords}`);
    console.log(`✅ Successful:     ${result.successCount} (${((result.successCount/result.totalRecords)*100).toFixed(1)}%)`);
    console.log(`❌ Failed:         ${result.failureCount} (${((result.failureCount/result.totalRecords)*100).toFixed(1)}%)`);
    console.log(`⏱️  Duration:       ${(result.duration/1000).toFixed(2)} seconds`);
    console.log('='.repeat(60));

    if (result.errors.length > 0) {
      console.log('\\n❌ FAILED RECORDS:');
      result.errors.forEach(err => {
        console.log(`  - ${err.orderNumber}: ${err.error}`);
      });
    }

    if (result.success) {
      console.log('\\n✅ Migration completed successfully!');
      console.log('   All 112 order records have been added to the database.');
      console.log('   You can now remove the hardcoded data from order-data.service.ts');
    } else {
      console.log('\\n⚠️  Migration completed with errors.');
      console.log('   Please review failed records and retry if necessary.');
    }

    console.log('='.repeat(60) + '\\n');
  }

  /**
   * Validate migration (check if orders exist in database)
   */
  validateMigration(): Observable<any> {
    const orders = this.orderDataService.getAllOrderRecords();
    const sampleSize = 10;
    const samples = orders.slice(0, sampleSize);

    console.log(`🔍 Validating migration with ${sampleSize} sample records...`);

    return this.databaseService.getSales().pipe(
      map(sales => {
        const saleNumbers = sales.map(s => s.saleNumber);
        const found = samples.filter(order =>
          saleNumbers.includes(order.orderNumber)
        );

        console.log(`Found ${found.length}/${sampleSize} sample records in database`);

        return {
          validated: found.length === sampleSize,
          found: found.length,
          total: sampleSize,
          percentage: (found.length / sampleSize) * 100
        };
      }),
      catchError(error => {
        console.error('Validation failed:', error);
        return of({ validated: false, error: error.message });
      })
    );
  }
}
