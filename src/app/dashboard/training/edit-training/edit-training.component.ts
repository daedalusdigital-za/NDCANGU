import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../services/data/database.service';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss']
})
export class EditTrainingComponent implements OnInit {
  trainingId: number = 0;
  training: any = {
    id: 0,
    trainingName: '',
    trainingType: '',
    trainingDate: '',
    provinceId: null,
    provinceName: '',
    venue: '',
    trainerId: null,
    trainer: null,
    targetAudience: '',
    status: 1,
    statusText: '',
    dateCreated: null,
    lastUpdated: null,
    createdByUserName: ''
  };

  trainers: any[] = [];
  isLoading = false;
  isSubmitting = false;

  // Status options
  statusOptions = [
    { value: 1, label: 'Scheduled' },
    { value: 2, label: 'In Progress' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Cancelled' },
    { value: 5, label: 'Planned' }
  ];

  // Province options with IDs to match API
  provinces = [
    { id: 1, name: 'Gauteng' },
    { id: 2, name: 'Western Cape' },
    { id: 3, name: 'KwaZulu-Natal' },
    { id: 4, name: 'Eastern Cape' },
    { id: 5, name: 'Free State' },
    { id: 6, name: 'Limpopo' },
    { id: 7, name: 'Mpumalanga' },
    { id: 8, name: 'North West' },
    { id: 9, name: 'Northern Cape' }
  ];

  // Training type options
  trainingTypes = [
    'Workshop',
    'Seminar',
    'Conference',
    'Training Session',
    'Webinar',
    'Hands-on Training'
  ];

  // Target audience options
  targetAudiences = [
    'Healthcare Workers',
    'Doctors',
    'Nurses',
    'Pharmacists',
    'Allied Health Professionals',
    'Healthcare Administrators'
  ];

  // Venue options
  venues = [
    'Johannesburg Convention Centre',
    'Cape Town International Convention Centre',
    'Durban ICC',
    'Sandton Convention Centre',
    'Chris Hani Baragwanath Hospital',
    'Charlotte Maxeke Hospital',
    'Groote Schuur Hospital',
    'Tygerberg Hospital',
    'Inkosi Albert Luthuli Hospital',
    'King Edward VIII Hospital'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    // Get the training ID from route params
    this.route.params.subscribe((params) => {
      this.trainingId = params['id'] || 0;
      this.loadTrainers();
      if (this.trainingId > 0) {
        this.loadTrainingSession();
      }
    });
    this.loadTrainingSession();
  }

  loadTrainers(): void {
    this.databaseService.getTrainers().subscribe({
      next: (trainers) => {
        this.trainers = trainers.filter(t => t.status === 'Active');
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.toastr.error('Failed to load trainers', 'Error');
      }
    });
  }

  loadTrainingSession(): void {
    this.isLoading = true;
    this.databaseService.getTrainingSessionById(this.trainingId).subscribe({
      next: (session) => {
        this.training = { ...session };
        // Format the date for input field (API returns datetime, we need date)
        if (this.training.trainingDate) {
          this.training.trainingDate = this.formatDateForInput(this.training.trainingDate);
        }
        // Set the trainerId for the dropdown selection
        if (this.training.trainer) {
          this.training.trainerId = this.training.trainer.id;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading training session:', error);
        this.toastr.error('Failed to load training session', 'Error');
        this.router.navigate(['/dashboard/training/list']);
      }
    });
  }

  updateTraining(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;

      // Prepare the data for API
      const updateData: any = {
        id: this.training.id,
        trainingName: this.training.trainingName,
        trainingType: this.training.trainingType,
        trainingDate: this.training.trainingDate + 'T09:00:00', // Convert to datetime format
        provinceId: Number(this.training.provinceId),
        venue: this.training.venue,
        trainerId: this.training.trainerId ? Number(this.training.trainerId) : null,
        targetAudience: this.training.targetAudience,
        status: Number(this.training.status)
      };

      this.databaseService.updateTrainingSession(updateData as any).subscribe({
        next: (result) => {
          this.isSubmitting = false;
          this.toastr.success('Training session updated successfully!', 'Success');
          this.router.navigate(['/dashboard/training/list']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating training session:', error);
          this.toastr.error('Failed to update training session', 'Error');
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.training.trainingName || this.training.trainingName.trim() === '') {
      this.toastr.error('Training name is required', 'Validation Error');
      return false;
    }

    if (!this.training.trainingDate) {
      this.toastr.error('Training date is required', 'Validation Error');
      return false;
    }

    if (!this.training.provinceId) {
      this.toastr.error('Province is required', 'Validation Error');
      return false;
    }

    if (!this.training.venue) {
      this.toastr.error('Venue is required', 'Validation Error');
      return false;
    }

    if (!this.training.trainingType) {
      this.toastr.error('Training type is required', 'Validation Error');
      return false;
    }

    if (!this.training.targetAudience) {
      this.toastr.error('Target audience is required', 'Validation Error');
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/dashboard/training/list']);
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
