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
  name: string;
  email: string;
  phone: string;
  // Location
  provinceId: number;
  province?: string; // Display name from provinces array
  location: string;
  // Status
  status: string; // Active/Inactive
  // Optional fields
  qualification?: string;
  experience?: number;
  bio?: string;
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
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

  // Get initials for avatar
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

    // Populate form with trainer data
    this.trainerForm.patchValue({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      provinceId: trainer.provinceId,
      location: trainer.location,
      status: trainer.status
    });

    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editTrainerModal'));
    editModal.show();
  }

  // Delete trainer
  deleteTrainer(trainer: Trainer, index: number): void {
    const confirmDelete = confirm(`Are you sure you want to delete trainer "${trainer.name}"?`);

    if (confirmDelete) {
      this.trainers.splice(index, 1);
      this.toastr.success(`${trainer.name} has been removed from the system`, 'Trainer Deleted');
    }
  }

  // Submit new trainer
  onSubmit(): void {
    if (this.trainerForm.valid) {
      const formValue = this.trainerForm.value;
      const province = this.getProvinceName(formValue.provinceId);

      const newTrainer: Trainer = {
        id: this.getNextId(),
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        provinceId: formValue.provinceId,
        province: province,
        location: formValue.location,
        status: formValue.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.trainers.push(newTrainer);
      this.toastr.success(`${newTrainer.name} has been added successfully`, 'Trainer Added');

      // Reset form and close modal
      this.trainerForm.reset();
      this.trainerForm.patchValue({ status: 'Active' });

      const modal = bootstrap.Modal.getInstance(document.getElementById('addTrainerModal'));
      modal?.hide();
    } else {
      this.toastr.error('Please fill in all required fields correctly', 'Form Error');
      this.markFormGroupTouched(this.trainerForm);
    }
  }

  // Update trainer
  onUpdateSubmit(): void {
    if (this.trainerForm.valid && this.editingIndex !== -1) {
      const formValue = this.trainerForm.value;
      const province = this.getProvinceName(formValue.provinceId);

      const updatedTrainer: Trainer = {
        ...this.editingTrainer!,
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        provinceId: formValue.provinceId,
        province: province,
        location: formValue.location,
        status: formValue.status,
        updatedAt: new Date().toISOString()
      };

      this.trainers[this.editingIndex] = updatedTrainer;
      this.toastr.success(`${updatedTrainer.name} has been updated successfully`, 'Trainer Updated');

      // Reset form and close modal
      this.trainerForm.reset();
      this.trainerForm.patchValue({ status: 'Active' });
      this.editingTrainer = null;
      this.editingIndex = -1;

      const modal = bootstrap.Modal.getInstance(document.getElementById('editTrainerModal'));
      modal?.hide();
    } else {
      this.toastr.error('Please fill in all required fields correctly', 'Form Error');
      this.markFormGroupTouched(this.trainerForm);
    }
  }

  // Helper methods
  private getNextId(): number {
    return Math.max(...this.trainers.map(t => t.id)) + 1;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getStatusDisplay(status: number | string): string {
    if (status === 1 || status === 'Active') {
      return 'Active';
    }
    return 'Inactive';
  }

  getStatusClass(status: number | string): string {
    return (status === 1 || status === 'Active') ? 'bg-success' : 'bg-warning';
  }
}
