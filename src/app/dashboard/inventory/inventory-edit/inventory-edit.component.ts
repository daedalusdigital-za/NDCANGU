import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { InventoryCategory, InventoryStatus, InventoryItem, InventoryItemModel } from '../../../shared/interfaces/common.interfaces';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.scss']
})
export class InventoryEditComponent implements OnInit {
  editForm!: FormGroup;
  loading = false;
  loadingItem = true;
  submitted = false;
  itemId: number;
  originalItem?: InventoryItem;

  // Enum options for dropdowns
  categoryOptions = [
    { value: InventoryCategory.MedicalSupplies, label: 'Medical Supplies' },
    { value: InventoryCategory.Consumables, label: 'Consumables' },
    { value: InventoryCategory.Equipment, label: 'Equipment' },
    { value: InventoryCategory.Pharmaceuticals, label: 'Pharmaceuticals' },
    { value: InventoryCategory.Other, label: 'Other' }
  ];

  statusOptions = [
    { value: InventoryStatus.Active, label: 'Active' },
    { value: InventoryStatus.Inactive, label: 'Inactive' },
    { value: InventoryStatus.Discontinued, label: 'Discontinued' }
  ];

  unitOfMeasureOptions = [
    'Each', 'Box', 'Case', 'Pack', 'Bottle', 'Vial', 'Tube', 'Roll', 'Meter', 'Kilogram', 'Gram', 'Liter', 'Milliliter'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadInventoryItem();
  }

  private initializeForm(): void {
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      category: [InventoryCategory.MedicalSupplies, [Validators.required]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      stockAvailable: [0, [Validators.required, Validators.min(0)]],
      minimumStockLevel: [0, [Validators.required, Validators.min(0)]],
      unitOfMeasure: ['Each', [Validators.required]],
      supplier: ['', [Validators.maxLength(100)]],
      supplierContact: ['', [Validators.maxLength(100)]],
      status: [InventoryStatus.Active, [Validators.required]],
      notes: ['', [Validators.maxLength(1000)]]
    });
  }

  private loadInventoryItem(): void {
    if (!this.itemId || isNaN(this.itemId)) {
      this.toastr.error('Invalid item ID');
      this.router.navigate(['/dashboard/inventory/list']);
      return;
    }

    this.loadingItem = true;
    this.inventoryService.getItemById(this.itemId).subscribe({
      next: (item) => {
        this.originalItem = item;
        this.populateForm(item);
        this.loadingItem = false;
      },
      error: (error) => {
        console.error('Error loading inventory item:', error);
        if (error.status === 404) {
          this.toastr.error('Inventory item not found');
        } else {
          this.toastr.error('Failed to load inventory item');
        }
        this.router.navigate(['/dashboard/inventory/list']);
      }
    });
  }

  private populateForm(item: InventoryItem): void {
    this.editForm.patchValue({
      name: item.name,
      description: item.description || '',
      sku: item.sku,
      category: item.category,
      unitPrice: item.unitPrice,
      stockAvailable: item.stockAvailable,
      reorderLevel: item.reorderLevel,
      unitOfMeasure: item.unitOfMeasure,
      supplier: item.supplier || '',
      supplierContact: item.supplierContact || '',
      status: item.status,
      notes: item.notes || ''
    });

    // Mark form as pristine after initial population
    this.editForm.markAsPristine();
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.editForm.invalid) {
      this.markFormGroupTouched();
      this.toastr.error('Please correct the errors in the form');
      return;
    }

    if (!this.editForm.dirty) {
      this.toastr.info('No changes detected');
      return;
    }

    this.loading = true;
    const formData = this.editForm.value;

    // Create inventory item model
    const inventoryItem: InventoryItemModel = {
      id: this.itemId, // Include the ID in the object
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      unitPrice: parseFloat(formData.unitPrice),
      stockAvailable: parseInt(formData.stockAvailable),
      reorderLevel: parseInt(formData.reorderLevel) || parseInt(formData.minimumStockLevel) || 0,
      minimumStockLevel: parseInt(formData.minimumStockLevel) || parseInt(formData.reorderLevel) || 0,
      unitOfMeasure: formData.unitOfMeasure,
      supplier: formData.supplier?.trim() || '',
      supplierContact: formData.supplierContact?.trim() || '',
      status: formData.status,
      notes: formData.notes?.trim() || ''
    };

    this.inventoryService.updateItem(inventoryItem).subscribe({
      next: () => {
        this.toastr.success('Inventory item updated successfully!');
        this.router.navigate(['/dashboard/inventory/list']);
      },
      error: (error) => {
        console.error('Error updating inventory item:', error);
        if (error.status === 409) {
          this.toastr.error('SKU already exists. Please use a different SKU.');
          this.editForm.get('sku')?.setErrors({ duplicate: true });
        } else if (error.status === 404) {
          this.toastr.error('Inventory item not found');
        } else {
          this.toastr.error('Failed to update inventory item. Please try again.');
        }
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.editForm.dirty) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.router.navigate(['/dashboard/inventory/list']);
      }
    } else {
      this.router.navigate(['/dashboard/inventory/list']);
    }
  }

  onReset(): void {
    if (this.originalItem && confirm('Reset all changes to original values?')) {
      this.populateForm(this.originalItem);
      this.submitted = false;
    }
  }

  generateNewSku(): void {
    const name = this.editForm.get('name')?.value;
    if (name) {
      const newSku = this.generateSku(name);
      this.editForm.patchValue({ sku: newSku });
      this.editForm.get('sku')?.markAsDirty();
    }
  }

  private generateSku(name: string): string {
    // Generate SKU from name: take first 3 letters + random number
    const prefix = name.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
    const suffix = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    return `${prefix}${suffix}`;
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.editForm.get(fieldName);
    if (errorType) {
      return !!(field?.hasError(errorType) && (field?.dirty || field?.touched || this.submitted));
    }
    return !!(field?.invalid && (field?.dirty || field?.touched || this.submitted));
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${field?.errors?.['minlength']?.requiredLength} characters`;
    }
    if (field?.hasError('maxlength')) {
      return `${this.getFieldLabel(fieldName)} cannot exceed ${field?.errors?.['maxlength']?.requiredLength} characters`;
    }
    if (field?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} must be greater than ${field?.errors?.['min']?.min}`;
    }
    if (field?.hasError('pattern')) {
      return `${this.getFieldLabel(fieldName)} must contain only letters, numbers, and hyphens`;
    }
    if (field?.hasError('duplicate')) {
      return 'This SKU already exists';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      description: 'Description',
      sku: 'SKU',
      category: 'Category',
      unitPrice: 'Unit Price',
      stockAvailable: 'Stock Available',
      minimumStockLevel: 'Minimum Stock Level',
      unitOfMeasure: 'Unit of Measure',
      supplier: 'Supplier',
      supplierContact: 'Supplier Contact',
      status: 'Status',
      notes: 'Notes'
    };
    return labels[fieldName] || fieldName;
  }

  // Helper method to get item display name for header
  getItemDisplayName(): string {
    return this.originalItem?.name || `Item #${this.itemId}`;
  }

  // Helper method to check if item has low stock
  isLowStock(): boolean {
    if (!this.originalItem) return false;
    return this.originalItem.stockAvailable <= this.originalItem.reorderLevel;
  }
}
