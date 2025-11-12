import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../services/data/database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  isSubmitting = false;
  
  provinces: any[] = [];
  hospitals: any[] = [];
  trainers: any[] = [];
  filteredHospitals: any[] = [];
  trainingTypes = [
    'NCD Prevention Workshop',
    'Diabetes Management Course',
    'Hypertension Control Training',
    'Cardiovascular Health Training',
    'Nutrition & Lifestyle Training',
    'Mental Health Awareness',
    'Cancer Prevention Training',
    'Respiratory Health Training',
    'Kidney Health Training',
    'Community Health Training'
  ];

  // Status options based on schema (numeric values)
  statusOptions = [
    { value: 1, label: 'Planned' },
    { value: 2, label: 'Scheduled' },
    { value: 3, label: 'In Progress' },
    { value: 4, label: 'Completed' },
    { value: 5, label: 'Cancelled' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private databaseService: DatabaseService
  ) {
    this.trainingForm = this.fb.group({
      trainingName: ['', [Validators.required, Validators.minLength(3)]],
      trainingType: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      province: ['', Validators.required],
      hospital: ['', Validators.required],
      venue: ['', Validators.required],
      trainerId: ['', Validators.required],
      numberOfParticipants: ['', [Validators.required, Validators.min(1), Validators.max(500)]],
      targetAudience: ['', Validators.required],
      objectives: [''],
      materials: [''],
      status: [1, Validators.required] // Default to 1 (Planned)
    });
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadTrainers();
    
    this.trainingForm.get('province')?.valueChanges.subscribe(provinceId => {
      this.filterHospitals(provinceId);
    });
  }

  loadProvinces(): void {
    // Province functionality removed
    this.provinces = [];
    console.log('Province loading disabled');
  }

  loadTrainers(): void {
    this.databaseService.getTrainersWithFallback().subscribe({
      next: (trainers) => {
        this.trainers = trainers;
        console.log('Loaded trainers:', trainers);
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.toastr.error('Failed to load trainers', 'Error');
      }
    });
  }

  filterHospitals(provinceId: number): void {
    if (!provinceId) {
      this.filteredHospitals = [];
      return;
    }
    
    // For now, we'll use a simple fallback list since hospital endpoints aren't available
    // This should be replaced with DatabaseService call when hospital endpoints are ready
    this.filteredHospitals = [
      { id: 1, name: 'Chris Hani Baragwanath Hospital', provinceId: 1 },
      { id: 2, name: 'Charlotte Maxeke Hospital', provinceId: 1 },
      { id: 3, name: 'Inkosi Albert Luthuli Hospital', provinceId: 2 },
      { id: 4, name: 'King Edward VIII Hospital', provinceId: 2 },
      { id: 5, name: 'Groote Schuur Hospital', provinceId: 4 },
      { id: 6, name: 'Tygerberg Hospital', provinceId: 4 }
    ].filter(hospital => hospital.provinceId === provinceId);
    
    this.trainingForm.get('hospital')?.setValue('');
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      this.isSubmitting = true;
      
      const formData = this.trainingForm.value;
      
      // Convert form data to match the exact API schema
      const trainingSession = {
        trainingName: formData.trainingName,
        trainingType: formData.trainingType,
        description: formData.description || '',
        startDate: this.formatDateForAPI(formData.startDate),
        endDate: this.formatDateForAPI(formData.endDate),
        startTime: {
          ticks: this.convertTimeToTicks(formData.startTime)
        },
        endTime: {
          ticks: this.convertTimeToTicks(formData.endTime)
        },
        province: formData.province,
        hospital: formData.hospital,
        venue: formData.venue,
        trainerId: parseInt(formData.trainerId),
        numberOfParticipants: parseInt(formData.numberOfParticipants),
        targetAudience: formData.targetAudience,
        objectives: formData.objectives || '',
        materials: formData.materials || '',
        status: parseInt(formData.status)
      };

      console.log('Training session payload:', trainingSession);

      // Try to save using API, fall back to local storage if needed
      this.saveTrainingSession(trainingSession);
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fill in all required fields correctly.', 'Form Error');
    }
  }

  private saveTrainingSession(trainingData: any): void {
    // Try to create training session via API
    this.databaseService.createTrainingSession(trainingData).subscribe({
      next: (response) => {
        console.log('Training session created successfully:', response);
        this.toastr.success('Training session added successfully!', 'Success');
        this.isSubmitting = false;
        this.resetForm();
        this.router.navigate(['/dashboard/training/list']);
      },
      error: (error) => {
        console.error('Error creating training session via API:', error);
        
        // Fallback: Save to local storage for development
        this.saveToLocalStorage(trainingData);
        this.toastr.success('Training session saved locally (API unavailable)', 'Success');
        this.isSubmitting = false;
        this.resetForm();
        this.router.navigate(['/dashboard/training/list']);
      }
    });
  }

  private saveToLocalStorage(trainingData: any): void {
    try {
      // Get existing sessions or create empty array
      const existingSessions = JSON.parse(localStorage.getItem('trainingSessions') || '[]');
      
      // Add new session with generated ID
      const sessionWithId = {
        ...trainingData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      existingSessions.push(sessionWithId);
      localStorage.setItem('trainingSessions', JSON.stringify(existingSessions));
      
      console.log('Training session saved to localStorage:', sessionWithId);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      this.toastr.error('Failed to save training session', 'Error');
    }
  }

  private resetForm(): void {
    this.trainingForm.reset();
    this.trainingForm.get('status')?.setValue(1); // Reset to Planned
    this.filteredHospitals = [];
  }

  // Helper method to format date for API (ISO format)
  private formatDateForAPI(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  }

  // Helper method to convert time string to ticks
  private convertTimeToTicks(timeString: string): number {
    if (!timeString) return 0;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    // Convert to ticks (100 nanoseconds since midnight)
    // 1 tick = 100 nanoseconds
    // 1 millisecond = 10,000 ticks
    // 1 second = 10,000,000 ticks
    // 1 minute = 600,000,000 ticks
    // 1 hour = 36,000,000,000 ticks
    
    const totalTicks = (hours * 36000000000) + (minutes * 600000000);
    return totalTicks;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.trainingForm.controls).forEach(field => {
      const control = this.trainingForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.trainingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.trainingForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min']) return `${fieldName} must be at least ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} must be at most ${field.errors['max'].max}`;
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/training']);
  }

  onReset(): void {
    this.resetForm();
    this.toastr.info('Form has been reset', 'Reset');
  }
}
