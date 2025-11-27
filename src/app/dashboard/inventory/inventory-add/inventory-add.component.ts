import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { InventoryCategory, InventoryStatus, InventoryItemModel } from '../../../shared/interfaces/common.interfaces';

@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.scss']
})
export class InventoryAddComponent implements OnInit {
  addForm!: FormGroup;
  loading = false;
  submitted = false;

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
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.addForm = this.formBuilder.group({
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

    // Auto-generate SKU based on name
    this.addForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.addForm.get('sku')?.dirty) {
        const generatedSku = this.generateSku(name);
        this.addForm.patchValue({ sku: generatedSku });
      }
    });
  }

  private generateSku(name: string): string {
    // Generate SKU from name: take first 3 letters + random number
    const prefix = name.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
    const suffix = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    return `${prefix}${suffix}`;
  }

  get f() {
    return this.addForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.addForm.invalid) {
      this.markFormGroupTouched();
      this.toastr.error('Please correct the errors in the form');
      return;
    }

    this.loading = true;
    const formData = this.addForm.value;

    // Create inventory item model
    const inventoryItem: InventoryItemModel = {
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

    this.inventoryService.addItem(inventoryItem).subscribe({
      next: () => {
        this.toastr.success('Inventory item added successfully!');
        this.router.navigate(['/dashboard/inventory/list']);
      },
      error: (error) => {
        console.error('Error adding inventory item:', error);
        if (error.status === 409) {
          this.toastr.error('SKU already exists. Please use a different SKU.');
          this.addForm.get('sku')?.setErrors({ duplicate: true });
        } else {
          this.toastr.error('Failed to add inventory item. Please try again.');
        }
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addForm.controls).forEach(key => {
      const control = this.addForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.addForm.dirty) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.router.navigate(['/dashboard/inventory/list']);
      }
    } else {
      this.router.navigate(['/dashboard/inventory/list']);
    }
  }

  onSkuChange(): void {
    // Mark SKU as dirty when manually changed
    this.addForm.get('sku')?.markAsDirty();
  }

  generateNewSku(): void {
    const name = this.addForm.get('name')?.value;
    if (name) {
      const newSku = this.generateSku(name);
      this.addForm.patchValue({ sku: newSku });
      this.addForm.get('sku')?.markAsDirty();
    }
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.addForm.get(fieldName);
    if (errorType) {
      return !!(field?.hasError(errorType) && (field?.dirty || field?.touched || this.submitted));
    }
    return !!(field?.invalid && (field?.dirty || field?.touched || this.submitted));
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const field = this.addForm.get(fieldName);
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
}
