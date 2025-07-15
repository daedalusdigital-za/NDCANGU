import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  status: string;
  location: string;
  bio: string;
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

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.trainerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      specialization: ['', Validators.required],
      qualification: [''],
      experience: [0, [Validators.min(0)]],
      status: ['Active', Validators.required],
      location: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadTrainers();
  }

  // Load initial trainers data
  loadTrainers(): void {
    this.trainers = [
      {
        id: 1,
        name: 'Dr. Thabo Mthembu',
        email: 'thabo.mthembu@health.gov.za',
        phone: '+27721234567',
        specialization: 'Diabetes Management',
        qualification: 'MD',
        experience: 8,
        status: 'Active',
        location: 'Johannesburg General Hospital',
        bio: 'Experienced diabetes specialist with focus on community health'
      },
      {
        id: 2,
        name: 'Dr. Nomsa Dlamini',
        email: 'nomsa.dlamini@health.gov.za',
        phone: '+27721234568',
        specialization: 'Hypertension Control',
        qualification: 'MD, PhD',
        experience: 12,
        status: 'Active',
        location: 'Cape Town Medical Center',
        bio: 'Cardiovascular health expert with research background'
      },
      {
        id: 3,
        name: 'Dr. Sipho Ndaba',
        email: 'sipho.ndaba@health.gov.za',
        phone: '+27721234569',
        specialization: 'NCD Prevention',
        qualification: 'MD, MSc',
        experience: 6,
        status: 'Active',
        location: 'Durban Health District',
        bio: 'Community health advocate specializing in NCD prevention'
      }
    ];
  }

  // Get initials for avatar
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  // View trainer details
  viewTrainer(trainer: Trainer): void {
    this.selectedTrainer = trainer;
    // Modal will be opened via Bootstrap data attributes
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
      specialization: trainer.specialization,
      qualification: trainer.qualification,
      experience: trainer.experience,
      status: trainer.status,
      location: trainer.location,
      bio: trainer.bio
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
      const newTrainer: Trainer = {
        id: this.getNextId(),
        ...this.trainerForm.value
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
      const updatedTrainer: Trainer = {
        id: this.editingTrainer!.id,
        ...this.trainerForm.value
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
}
