# Medical Equipment Orders Migration Guide

## 📋 Overview
This guide explains how to migrate 112 hardcoded medical equipment order records from `order-data.service.ts` into the database using the Sales API endpoints.

## 🎯 Purpose
Currently, the Medical Equipment Orders (112 records) are hardcoded in the frontend. This migration will:
- Transfer all order data to the database
- Enable proper CRUD operations via API
- Allow backend data management
- Remove hardcoded data dependency

## 🔧 Migration Service

### File Created: `order-migration.service.ts`

**Key Features:**
- Converts OrderRecord format to Sale API format
- Handles batch migration of all 112 records
- Provides detailed migration reporting
- Includes validation and error handling

### Data Transformation Mapping:

| Order Field | Sale Field | Transformation |
|------------|------------|----------------|
| orderNumber | saleNumber | Direct mapping |
| orderDate | saleDate | Convert "2025/08/11" → "2025-08-11T00:00:00Z" |
| customerName | hospital | Direct mapping |
| province | province | Direct mapping |
| poNumber | invoiceNumber | Direct mapping |
| itemDescription | saleItems[0].productName | Wrapped in array |
| qtyBackOrder | saleItems[0].quantity | Direct mapping |
| unitPrice | saleItems[0].unitPrice | Direct mapping |
| status "Not delivered" | deliveryStatus: 0 | 0=Pending, 3=Delivered |
| - | paymentMethod | Default: 3 (Invoice) |
| - | paymentStatus | 0=Pending (not delivered), 1=Paid (delivered) |
| - | customerContactName | Generated from institution type |
| - | customerContactEmail | Generated: institution@health.gov.za |

## 🚀 How to Run Migration

### Option 1: Via Browser Console (Recommended for Testing)

1. **Start the application:**
   ```bash
   ng serve
   ```

2. **Login to the application** (authentication required for API)

3. **Open browser console** (F12)

4. **Run single order test:**
   ```typescript
   // Test with first order
   const migration = document.querySelector('app-root')
     .__ngContext__[8]
     .injector.get('OrderMigrationService');
   
   migration.migrateSingleOrder('ORD144962').subscribe(result => {
     console.log('Test Result:', result);
   });
   ```

5. **Run full migration:**
   ```typescript
   // Migrate all 112 records
   migration.migrateAllOrders().subscribe(result => {
     console.log('Migration complete!', result);
   });
   ```

6. **Validate migration:**
   ```typescript
   // Check if records exist in database
   migration.validateMigration().subscribe(result => {
     console.log('Validation:', result);
   });
   ```

### Option 2: Create Migration Button in UI

Add a migration button to the admin dashboard or sales page:

```typescript
// In list-sales.component.ts
import { OrderMigrationService } from '../../../services/order-migration.service';

constructor(
  private migrationService: OrderMigrationService
) {}

runMigration(): void {
  if (confirm('Migrate 112 orders to database? This cannot be undone.')) {
    this.migrationService.migrateAllOrders().subscribe(result => {
      if (result.success) {
        alert(`✅ Migration successful! ${result.successCount} records added.`);
      } else {
        alert(`⚠️ Migration completed with ${result.failureCount} errors.`);
      }
    });
  }
}
```

```html
<!-- In list-sales.component.html -->
<button class="btn btn-warning" (click)="runMigration()">
  <i class="dripicons-upload"></i> Migrate Orders to Database
</button>
```

### Option 3: Create Standalone Migration Script

Create a one-time migration script that runs on app initialization:

```typescript
// In app.component.ts (run once on startup)
ngOnInit() {
  const migrationComplete = localStorage.getItem('ordersMigrated');
  
  if (!migrationComplete && this.authService.isAuthenticated()) {
    this.orderMigrationService.migrateAllOrders().subscribe(result => {
      if (result.success) {
        localStorage.setItem('ordersMigrated', 'true');
        console.log('✅ Orders migrated successfully on first load');
      }
    });
  }
}
```

## 📊 Expected Migration Output

```
============================================================
📊 MIGRATION REPORT
============================================================
Total Records:    112
✅ Successful:     112 (100.0%)
❌ Failed:         0 (0.0%)
⏱️  Duration:       8.45 seconds
============================================================

✅ Migration completed successfully!
   All 112 order records have been added to the database.
   You can now remove the hardcoded data from order-data.service.ts
============================================================
```

## ✅ Post-Migration Steps

### 1. Verify Data in Database
```sql
-- Check count
SELECT COUNT(*) FROM Sales WHERE SaleNumber LIKE 'ORD%';
-- Should return 112

-- View sample records
SELECT TOP 10 * FROM Sales 
WHERE SaleNumber LIKE 'ORD%' 
ORDER BY SaleDate DESC;
```

### 2. Update list-sales.component.ts

**Before (hardcoded):**
```typescript
loadOrders(): void {
  this.orders = this.orderDataService.getAllOrderRecords();
  this.filteredOrders = [...this.orders];
}
```

**After (from database):**
```typescript
loadOrders(): void {
  this.databaseService.getSales().subscribe({
    next: (sales) => {
      // Convert sales to order format for display
      this.orders = sales.map(sale => this.convertSaleToOrder(sale));
      this.filteredOrders = [...this.orders];
    },
    error: (error) => {
      console.error('Error loading orders:', error);
      // Fallback to hardcoded data if API fails
      this.orders = this.orderDataService.getAllOrderRecords();
      this.filteredOrders = [...this.orders];
    }
  });
}

private convertSaleToOrder(sale: any): OrderRecord {
  return {
    orderNumber: sale.saleNumber,
    orderDate: sale.saleDate.split('T')[0].replace(/-/g, '/'),
    customerName: sale.hospital,
    province: sale.province,
    poNumber: sale.invoiceNumber,
    itemDescription: sale.saleItems[0]?.productName || '',
    qtyBackOrder: sale.saleItems[0]?.quantity || 0,
    unitPrice: sale.saleItems[0]?.unitPrice || 0,
    status: sale.deliveryStatus === 0 ? 'Not delivered' : 'Delivered',
    totalValue: sale.totalAmount
  };
}
```

### 3. Optional: Remove Hardcoded Data

Once confirmed working, you can:
1. **Keep hardcoded data as fallback** (recommended initially)
2. **Remove hardcoded array** from `order-data.service.ts`
3. **Update service to only use API** calls

## ⚠️ Important Notes

### Authentication Required
- Migration requires valid JWT token
- User must be logged in before running migration
- API endpoint: `POST /api/Sales/Add` requires authentication

### Duplicate Prevention
- Check if orders already exist before migrating
- Use `validateMigration()` to verify
- Consider adding unique constraint on `SaleNumber` in database

### Error Handling
- Failed records are logged with error messages
- Partial migration supported (can retry failed records)
- Original data remains in code until confirmed working

### Data Integrity
- Each order becomes a Sale with single SaleItem
- Quantities preserved as-is (qtyBackOrder)
- Status mapped: "Not delivered" → Pending (0), Other → Delivered (3)
- Generated fields: contact names, emails (standardized format)

## 🔍 Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Ensure user is logged in before migration

### Issue: 500 Internal Server Error
**Solution:** Check backend API logs, verify Sales table schema

### Issue: Duplicate records
**Solution:** Query database first to check existing records:
```typescript
this.databaseService.getSales().subscribe(sales => {
  const existing = sales.filter(s => s.saleNumber.startsWith('ORD'));
  console.log(`${existing.length} orders already in database`);
});
```

### Issue: Product IDs not matching
**Solution:** First migrate products to database, then update SaleItem.productId references

## 📈 Benefits After Migration

✅ **Dynamic Data Management**
- Add/edit/delete orders via API
- No code deployment needed for data changes

✅ **Better Performance**
- Database queries faster than hardcoded arrays
- Pagination and filtering on backend

✅ **Data Consistency**
- Single source of truth (database)
- No sync issues between frontend/backend

✅ **Reporting & Analytics**
- SQL queries for complex reports
- Integration with BI tools

✅ **Scalability**
- Handle thousands of records efficiently
- No frontend memory constraints

## 🎯 Next Steps

1. **Run migration** (test with single order first)
2. **Validate** all 112 records in database
3. **Update frontend** to load from API
4. **Test thoroughly** (CRUD operations)
5. **Remove hardcoded data** (optional, after confirmation)
6. **Deploy to production**

---

**Created:** November 14, 2025  
**Status:** Ready for Migration  
**Priority:** Medium - Improves data management and scalability
