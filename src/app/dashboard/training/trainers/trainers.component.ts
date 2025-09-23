import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupPreviewService } from '../../../services/popup-preview/popup-preview.service';

declare var bootstrap: any;

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  province: string;
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
    private formBuilder: FormBuilder,
    private popupPreviewService: PopupPreviewService
  ) {
    this.trainerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      province: ['', Validators.required],
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
        name: 'ZIBA',
        email: 'ziba@Promedtechnologies.co.za',
        phone: '+27721234567',
        province: 'Gauteng',
        qualification: 'MD',
        experience: 8,
        status: 'Active',
        location: 'Johannesburg',
        bio: 'Experienced medical trainer with focus on community health'
      },
      {
        id: 2,
        name: 'LINDANI',
        email: 'lindani@Promedtechnologies.co.za',
        phone: '+27721234568',
        province: 'KwaZulu-Natal',
        qualification: 'MD, PhD',
        experience: 12,
        status: 'Active',
        location: 'Durban',
        bio: 'Medical specialist with extensive training background'
      },
      {
        id: 3,
        name: 'KEHOLIHLE',
        email: 'keholihle@Promedtechnologies.co.za',
        phone: '+27721234569',
        province: 'Western Cape',
        qualification: 'MD, MSc',
        experience: 6,
        status: 'Active',
        location: 'Cape Town',
        bio: 'Community health advocate specializing in medical training'
      },
      {
        id: 4,
        name: 'SELBY',
        email: 'selby@Promedtechnologies.co.za',
        phone: '+27721234570',
        province: 'Eastern Cape',
        qualification: 'MD',
        experience: 10,
        status: 'Active',
        location: 'Port Elizabeth',
        bio: 'Medical trainer with focus on rural health programs'
      },
      {
        id: 5,
        name: 'MASI',
        email: 'masi@Promedtechnologies.co.za',
        phone: '+27721234571',
        province: 'Limpopo',
        qualification: 'MD, MSc',
        experience: 7,
        status: 'Active',
        location: 'Polokwane',
        bio: 'Healthcare professional with training expertise'
      },
      {
        id: 6,
        name: 'DYLAN',
        email: 'dylan@Promedtechnologies.co.za',
        phone: '+27721234572',
        province: 'Mpumalanga',
        qualification: 'MD',
        experience: 5,
        status: 'Active',
        location: 'Nelspruit',
        bio: 'Medical professional specializing in training programs'
      }
    ];
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
      province: trainer.province,
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
