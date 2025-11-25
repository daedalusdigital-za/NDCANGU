import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupPreviewService } from '../../../services/popup-preview/popup-preview.service';
import { DatabaseService } from '../../../services/data/database.service';

declare var bootstrap: any;

interface Trainer {
  id: number;
  // Personal Information
  firstName?: string;
  lastName?: string;
  name: string; // Computed display name - required
  email: string;
  phone: string;
  // Professional
  specialization?: string;
  experience?: number;
  certification?: string;
  // Location
  provinceId?: number;
  province?: string;
  location?: string;
  // Status
  isActive?: boolean;
  status: string; // Active/Inactive - required
  isDeleted?: boolean;
  // Optional fields
  qualification?: string;
  bio?: string;
  // Audit fields
  dateCreated?: string;
  lastUpdated?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  modifiedBy?: string;
}

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss']
})
export class TrainersComponent implements OnInit {

  trainerForm: FormGroup;
  trainers: Trainer[] = [];
  selectedTrainer: Trainer | null = null;
  editingTrainer: Trainer | null = null;
  editingIndex: number = -1;

  // Province list matching database
  provinces = [
    { id: 1, name: 'Gauteng' },
    { id: 2, name: 'KwaZulu-Natal' },
    { id: 3, name: 'Eastern Cape' },
    { id: 4, name: 'Western Cape' },
    { id: 5, name: 'Limpopo' },
    { id: 6, name: 'Mpumalanga' },
    { id: 7, name: 'North West' },
    { id: 8, name: 'Free State' },
    { id: 9, name: 'Northern Cape' }
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private popupPreviewService: PopupPreviewService,
    private databaseService: DatabaseService
  ) {
    this.trainerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      provinceId: ['', Validators.required],
      location: ['', Validators.required],
      status: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTrainers();
  }

  // Load initial trainers data
  loadTrainers(): void {
    this.databaseService.getTrainersWithFallback().subscribe({
      next: (trainers) => {
        // Map database trainers with province names and ensure all required fields
        this.trainers = trainers.map(trainer => {
          const province = this.provinces.find(p => p.id === (trainer.provinceId || 1));
          // Ensure name is always a string (never undefined or null)
          const name = trainer.name && trainer.name.trim()
            ? trainer.name
            : `${trainer.firstName || ''} ${trainer.lastName || ''}`.trim() || 'Unknown Trainer';

          return {
            id: trainer.id,
            name: name,
            email: trainer.email || '',
            phone: trainer.phone || '',
            provinceId: trainer.provinceId || 1,
            province: province?.name || 'Unknown',
            location: trainer.location || '',
            status: trainer.status || (trainer.isActive ? 'Active' : 'Inactive'),
            qualification: trainer.qualification || trainer.specialization || '',
            experience: trainer.experience || 0,
            bio: trainer.bio,
            createdAt: trainer.dateCreated,
            updatedAt: trainer.lastUpdated,
            createdBy: trainer.updatedBy && typeof trainer.updatedBy === 'number' ? String(trainer.updatedBy) : undefined,
            updatedBy: trainer.modifiedBy && typeof trainer.modifiedBy === 'number' ? String(trainer.modifiedBy) : undefined
          } as Trainer;
        });
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.toastr.error('Error loading trainers data', 'Error');
      }
    });
  }

  // Get province name by ID
  getProvinceName(provinceId: number): string {
    const province = this.provinces.find(p => p.id === provinceId);
    return province?.name || 'Unknown';
  }

  // View trainer details
  viewTrainer(trainer: Trainer): void {
    const trainerData = {
      title: trainer.name,
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      province: trainer.province,
      qualification: trainer.qualification,
      experience: trainer.experience,
      status: trainer.status,
      location: trainer.location,
      bio: trainer.bio,
      description: `${trainer.name} is a ${trainer.qualification} with ${trainer.experience} years of experience, currently based in ${trainer.location}, ${trainer.province}. Status: ${trainer.status}.`
    };

    this.popupPreviewService.showTrainerPreview(trainerData);
  }

  // Get trainer statistics (mock data for demo)
  getTrainerStats() {
    if (!this.selectedTrainer) {
      return { totalTrainees: 0, completedSessions: 0, rating: 0 };
    }

    // Mock statistics - in a real app, this would come from an API
    const mockStats = {
      totalTrainees: Math.floor(Math.random() * 50) + 10,
      completedSessions: Math.floor(Math.random() * 100) + 20,
      rating: (Math.random() * 2 + 3).toFixed(1) // Random rating between 3.0 and 5.0
    };

    return mockStats;
  }

  // Edit trainer
  editTrainer(trainer: Trainer): void {
    this.editingTrainer = { ...trainer };
    this.editingIndex = this.trainers.findIndex(t => t.id === trainer.id);

    // Convert status to numeric value for form
    const statusValue = (trainer.status as any) === 'Active' || (trainer.status as any) === 1 ? 1 : 0;

    // Populate form with trainer data
    this.trainerForm.patchValue({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      provinceId: trainer.provinceId,
      location: trainer.location,
      status: statusValue
    });

    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editTrainerModal'));
    editModal.show();
  }

  // Delete trainer
  deleteTrainer(trainer: Trainer, index: number): void {
    const confirmDelete = confirm(`Are you sure you want to delete trainer "${trainer.name}"?`);

    if (confirmDelete) {
      this.databaseService.deleteTrainer(trainer.id).subscribe({
        next: () => {
          this.trainers.splice(index, 1);
          this.toastr.success(`${trainer.name} has been removed from the system`, 'Trainer Deleted');
        },
        error: (error) => {
          console.error('Error deleting trainer:', error);
          this.toastr.error('Failed to delete trainer. Please try again.', 'Error');
        }
      });
    }
  }

  // Submit new trainer
  onSubmit(): void {
    if (this.trainerForm.valid) {
      const formValue = this.trainerForm.value;
      const province = this.getProvinceName(formValue.provinceId);

      // Convert numeric status to display value
      const statusDisplay = formValue.status === 1 || formValue.status === '1' ? 'Active' : 'Inactive';

      // Extract first and last name from full name
      const nameParts = formValue.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create trainer object for API (match API expected format)
      const trainerData: Partial<any> = {
        firstName: firstName,
        lastName: lastName,
        email: formValue.email,
        phone: formValue.phone,
        provinceId: formValue.provinceId,
        location: formValue.location,
        isActive: statusDisplay === 'Active' ? true : false,
        specialization: '',
        experience: 0,
        certification: ''
      };

      // Call API to add trainer
      this.databaseService.createTrainer(trainerData).subscribe({
        next: (response: any) => {
          // Add the new trainer to local list with response data
          const fullName = `${response.firstName || ''} ${response.lastName || ''}`.trim() || formValue.name;
          const newTrainer: Trainer = {
            id: response.id,
            firstName: response.firstName || firstName,
            lastName: response.lastName || lastName,
            name: fullName,
            email: response.email || formValue.email,
            phone: response.phone || formValue.phone,
            provinceId: response.provinceId || formValue.provinceId,
            province: province,
            location: response.location || formValue.location,
            status: statusDisplay,
            isActive: statusDisplay === 'Active',
            specialization: response.specialization || '',
            experience: response.experience || 0,
            certification: response.certification || '',
            isDeleted: false,
            dateCreated: response.dateCreated || new Date().toISOString(),
            lastUpdated: response.lastUpdated || new Date().toISOString()
          };

          this.trainers.push(newTrainer);
          this.toastr.success(`${newTrainer.name} has been added successfully`, 'Trainer Added');

          // Reset form and close modal
          this.trainerForm.reset();
          this.trainerForm.patchValue({ status: 1 });

          const modal = bootstrap.Modal.getInstance(document.getElementById('addTrainerModal'));
          modal?.hide();
        },
        error: (error: any) => {
          console.error('Error adding trainer:', error);
          this.toastr.error('Failed to add trainer. Please try again.', 'Error');
        }
      });
    } else {
      this.toastr.error('Please fill in all required fields correctly', 'Form Error');
      this.markFormGroupTouched(this.trainerForm);
    }
  }  // Update trainer
  onUpdateSubmit(): void {
    if (this.trainerForm.valid && this.editingIndex !== -1) {
      const formValue = this.trainerForm.value;
      const province = this.getProvinceName(formValue.provinceId);

      // Convert numeric status to display value
      const statusDisplay = formValue.status === 1 || formValue.status === '1' ? 'Active' : 'Inactive';

      // Parse full name into firstName and lastName
      const nameParts = formValue.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create trainer object for API - match API expected format with all required fields
      const trainerData: Partial<any> = {
        id: this.editingTrainer!.id,
        firstName: firstName,
        lastName: lastName,
        email: formValue.email,
        phone: formValue.phone,
        provinceId: formValue.provinceId,
        location: formValue.location,
        isActive: statusDisplay === 'Active',
        specialization: this.editingTrainer!.specialization || '',
        experience: this.editingTrainer!.experience || 0,
        certification: this.editingTrainer!.certification || '',
        isDeleted: false,
        dateCreated: this.editingTrainer!.dateCreated || new Date().toISOString()
      };

      // Call API to update trainer
      this.databaseService.updateTrainer(trainerData as any).subscribe({
        next: (response: any) => {
          // Transform API response to component's display interface
          const fullName = `${response.firstName || firstName} ${response.lastName || lastName}`.trim();
          const updatedTrainer: Trainer = {
            id: response.id || this.editingTrainer!.id,
            firstName: response.firstName || firstName,
            lastName: response.lastName || lastName,
            name: fullName,
            email: response.email || formValue.email,
            phone: response.phone || formValue.phone,
            provinceId: response.provinceId || formValue.provinceId,
            province: province,
            location: response.location || formValue.location,
            status: statusDisplay,
            isActive: statusDisplay === 'Active',
            specialization: response.specialization || '',
            experience: response.experience || 0,
            certification: response.certification || '',
            isDeleted: false,
            dateCreated: response.dateCreated || this.editingTrainer!.dateCreated,
            lastUpdated: response.lastUpdated || new Date().toISOString()
          };

          this.trainers[this.editingIndex] = updatedTrainer;
          this.toastr.success(`${fullName} has been updated successfully`, 'Trainer Updated');

          // Reset form and close modal
          this.trainerForm.reset();
          this.trainerForm.patchValue({ status: 1 });
          this.editingTrainer = null;
          this.editingIndex = -1;

          const modal = bootstrap.Modal.getInstance(document.getElementById('editTrainerModal'));
          modal?.hide();
        },
        error: (error: any) => {
          console.error('Error updating trainer:', error);
          this.toastr.error('Failed to update trainer. Please try again.', 'Error');
        }
      });
    } else {
      this.toastr.error('Please fill in all required fields correctly', 'Form Error');
      this.markFormGroupTouched(this.trainerForm);
    }
  }

  // Helper methods
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getStatusDisplay(status: string | undefined): string {
    if (status === 'Active' || status === '1') {
      return 'Active';
    }
    return 'Inactive';
  }

  getStatusClass(status: string | undefined): string {
    return (status === 'Active' || status === '1') ? 'bg-success' : 'bg-warning';
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
