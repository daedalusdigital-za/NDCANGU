# Frontend Guide - Sales Update API

## 🎯 What Changed

The Sales Update API has been **completely rewritten** to properly handle sale item updates. The Total field is now **automatically calculated** and cannot be manually edited.

---

## ⚠️ CRITICAL: Total is Read-Only

### ❌ This Will NOT Work:
```javascript
// DON'T DO THIS - Total will be ignored!
const updateData = {
  id: 123,
  total: 9999,  // ← This will be IGNORED
  saleItems: []
};

await axios.put('/api/Sales/Update', updateData);
// Total will be recalculated from items, NOT from your value!
```

### ✅ This is the Correct Way:
```javascript
// DO THIS - Change item quantities/prices
const updateData = {
  id: 123,
  saleNumber: "SALE-2024-001",
  saleDate: "2024-01-30T10:00:00",
  customerName: "John Doe",
  customerPhone: "555-1234",
  notes: "Updated order",
  saleItems: [
    {
      id: 1,                  // Existing item
      inventoryItemId: 5,
      quantity: 10,           // ← Change this
      unitPrice: 150.00       // ← Or this
    }
  ]
  // Total will auto-calculate: 10 × 150 = R1,500
};

await axios.put('/api/Sales/Update', updateData);
```

---

## 📋 API Endpoint

```
PUT /api/Sales/Update
Content-Type: application/json
```

**Base URL (Production):** `https://ngcanduapi.azurewebsites.net`

---

## 📝 Request Body Structure

### Required Fields:
```typescript
interface SaleUpdateRequest {
  id: number;                    // Sale ID (required)
  saleNumber: string;            // Sale number (required)
  saleDate: string;              // ISO date string (required)
  customerName: string;          // Customer name (required)
  customerPhone?: string;        // Optional
  notes?: string;                // Optional
  saleItems: SaleItemUpdate[];   // At least 1 item required
}

interface SaleItemUpdate {
  id?: number;                   // Include for existing items
  inventoryItemId: number;       // Required
  quantity: number;              // Must be > 0
  unitPrice: number;             // Must be > 0
}
```

---

## 🔄 How SaleItems Work

### 1️⃣ Update Existing Item
Include the item's `id` to update it:
```javascript
saleItems: [
  {
    id: 456,              // ← Existing item ID
    inventoryItemId: 5,
    quantity: 20,         // New quantity
    unitPrice: 100.00
  }
]
```

### 2️⃣ Add New Item
Omit the `id` (or set to null/0):
```javascript
saleItems: [
  { id: 456, ... },      // Keep existing
  {
    // No ID = new item
    inventoryItemId: 7,
    quantity: 5,
    unitPrice: 200.00
  }
]
```

### 3️⃣ Remove Item
Simply don't include it in the array:
```javascript
// Original sale has items: [1, 2, 3]
saleItems: [
  { id: 1, ... },        // Keep item 1
  { id: 3, ... }         // Keep item 3
  // Item 2 omitted = will be removed
]
```

---

## 💻 React/TypeScript Example

### Complete Update Component:

```typescript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Sale {
  id: number;
  saleNumber: string;
  saleDate: string;
  customerName: string;
  customerPhone?: string;
  total: number;
  notes?: string;
  saleItems: SaleItem[];
}

interface SaleItem {
  id: number;
  inventoryItemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const SaleEditForm: React.FC<{ saleId: number }> = ({ saleId }) => {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSale();
  }, [saleId]);

  const loadSale = async () => {
    const response = await axios.get(`/api/Sales/GetById?id=${saleId}`);
    setSale(response.data);
  };

  const handleItemQuantityChange = (itemIndex: number, newQuantity: number) => {
    if (!sale) return;
    
    const updatedItems = [...sale.saleItems];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: newQuantity
    };
    
    setSale({ ...sale, saleItems: updatedItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale) return;

    setLoading(true);
    try {
      const updateData = {
        id: sale.id,
        saleNumber: sale.saleNumber,
        saleDate: sale.saleDate,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        notes: sale.notes,
        saleItems: sale.saleItems.map(item => ({
          id: item.id,
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      await axios.put('/api/Sales/Update', updateData);
      alert('Sale updated successfully!');
      
      // Reload to get updated total
      await loadSale();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update sale');
    } finally {
      setLoading(false);
    }
  };

  if (!sale) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Sale: {sale.saleNumber}</h2>
      
      <div>
        <label>Customer Name:</label>
        <input
          value={sale.customerName}
          onChange={(e) => setSale({ ...sale, customerName: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Phone:</label>
        <input
          value={sale.customerPhone || ''}
          onChange={(e) => setSale({ ...sale, customerPhone: e.target.value })}
        />
      </div>

      <h3>Items:</h3>
      {sale.saleItems.map((item, index) => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <div>Item ID: {item.inventoryItemId}</div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleItemQuantityChange(index, parseInt(e.target.value))}
            />
          </div>
          <div>Price: R{item.unitPrice.toFixed(2)}</div>
          <div>Subtotal: R{(item.quantity * item.unitPrice).toFixed(2)}</div>
        </div>
      ))}

      <div style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '20px 0' }}>
        Total: R{sale.saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
        <small style={{ fontSize: '0.6em', display: 'block', color: '#666' }}>
          (Auto-calculated from items)
        </small>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default SaleEditForm;
```

---

## 🔧 jQuery/Vanilla JS Example

```javascript
// Get the sale
async function loadSale(saleId) {
  const response = await fetch(`/api/Sales/GetById?id=${saleId}`);
  return await response.json();
}

// Update the sale
async function updateSale(saleId) {
  // Get current sale data
  const sale = await loadSale(saleId);
  
  // Modify item quantity (example)
  sale.saleItems[0].quantity = 10;
  
  // Prepare update data
  const updateData = {
    id: sale.id,
    saleNumber: sale.saleNumber,
    saleDate: sale.saleDate,
    customerName: sale.customerName,
    customerPhone: sale.customerPhone,
    notes: sale.notes,
    saleItems: sale.saleItems.map(item => ({
      id: item.id,
      inventoryItemId: item.inventoryItemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  };
  
  // Send update
  const response = await fetch('/api/Sales/Update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  if (response.ok) {
    const result = await response.json();
    console.log('Success:', result.message);
    
    // Reload sale to get updated total
    const updatedSale = await loadSale(saleId);
    console.log('New total:', updatedSale.total);
  } else {
    const error = await response.json();
    console.error('Error:', error.message);
  }
}

// Calculate total on the frontend (for display)
function calculateTotal(saleItems) {
  return saleItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
}
```

---

## ✅ Validation Rules

The API will reject requests that don't meet these criteria:

| Field | Rule | Error Message |
|-------|------|---------------|
| `id` | Must be > 0 | "Invalid sale ID" |
| `saleNumber` | Cannot be empty | "Sale number is required" |
| `customerName` | Cannot be empty | "Customer name is required" |
| `saleItems` | Must have at least 1 item | "At least one sale item is required" |
| `item.quantity` | Must be > 0 | "Item quantity must be greater than 0" |
| `item.unitPrice` | Must be > 0 | "Item unit price must be greater than 0" |

---

## 🎨 UI Best Practices

### 1. Display Total as Read-Only
```html
<!-- Show total but don't allow editing -->
<div class="total-display">
  <label>Total:</label>
  <span class="amount">R{{ calculateTotal(sale.saleItems) }}</span>
  <small class="hint">Calculated from items</small>
</div>
```

### 2. Update Total Live as User Edits Items
```javascript
// Recalculate whenever quantity/price changes
const handleItemChange = (index, field, value) => {
  const updatedItems = [...saleItems];
  updatedItems[index][field] = value;
  setSaleItems(updatedItems);
  
  // Total updates automatically in UI
  const newTotal = calculateTotal(updatedItems);
  setDisplayTotal(newTotal);
};
```

### 3. Show What Will Be Calculated
```html
<div class="item-row">
  <input v-model="item.quantity" type="number" />
  <span>×</span>
  <input v-model="item.unitPrice" type="number" />
  <span>=</span>
  <strong>R{{ item.quantity * item.unitPrice }}</strong>
</div>
```

---

## 🐛 Common Mistakes

### ❌ Mistake 1: Sending Total in Request
```javascript
// DON'T include total - it will be ignored
const bad = {
  id: 123,
  total: 9999,  // ❌ IGNORED!
  saleItems: [...]
};
```

### ❌ Mistake 2: Forgetting Item IDs for Existing Items
```javascript
// If updating existing items, MUST include their IDs
const bad = {
  saleItems: [
    {
      // ❌ Missing id - will be treated as NEW item
      inventoryItemId: 5,
      quantity: 10
    }
  ]
};

const good = {
  saleItems: [
    {
      id: 456,  // ✅ Existing item will be updated
      inventoryItemId: 5,
      quantity: 10
    }
  ]
};
```

### ❌ Mistake 3: Not Reloading After Update
```javascript
// After update, reload to get accurate total
await axios.put('/api/Sales/Update', updateData);

// ✅ Reload sale
const updated = await axios.get(`/api/Sales/GetById?id=${saleId}`);
setSale(updated.data);  // Now has correct total
```

---

## 📊 Response Handling

### Success Response (200 OK):
```json
{
  "message": "Sale updated successfully"
}
```

### Error Responses:

**400 Bad Request:**
```json
{
  "message": "At least one sale item is required"
}
```

**404 Not Found:**
```json
{
  "message": "Sale with ID 123 not found"
}
```

---

## 🧪 Testing Checklist

Before deploying your frontend changes:

- [ ] Can update sale customer name
- [ ] Can change item quantity
- [ ] Total recalculates correctly
- [ ] Can add new item to sale
- [ ] Can remove item from sale
- [ ] Validation errors display correctly
- [ ] Success message appears
- [ ] Data persists after page refresh

---

## 📞 Support

**API Base URL:** https://ngcanduapi.azurewebsites.net  
**Swagger Docs:** https://ngcanduapi.azurewebsites.net/swagger  
**API Version:** Latest (deployed Jan 30, 2026)

**Backend Changes:**
- Complete SaleItems CRUD support
- Automatic total calculation
- Comprehensive validation
- Audit trail tracking (UpdatedBy, LastUpdated)

---

## 🚀 Migration Guide

### If you have existing edit forms:

**Step 1:** Remove total input field
```html
<!-- REMOVE THIS -->
<input v-model="sale.total" type="number" />
```

**Step 2:** Make total display-only
```html
<!-- ADD THIS -->
<div class="total-display">
  R{{ calculateTotal(sale.saleItems) }}
</div>
```

**Step 3:** Update your submit function
```javascript
// OLD - Don't send total
const old = {
  id: sale.id,
  total: sale.total,  // ❌ Remove this
  ...
};

// NEW - Only send items
const updated = {
  id: sale.id,
  saleNumber: sale.saleNumber,
  saleDate: sale.saleDate,
  customerName: sale.customerName,
  customerPhone: sale.customerPhone,
  notes: sale.notes,
  saleItems: sale.saleItems.map(item => ({
    id: item.id,
    inventoryItemId: item.inventoryItemId,
    quantity: item.quantity,
    unitPrice: item.unitPrice
  }))
};
```

**Step 4:** Test thoroughly!

---

**Last Updated:** January 30, 2026  
**Status:** ✅ Production Ready  
**Deployment:** Live on Azure
