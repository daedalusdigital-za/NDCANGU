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

  // Status options based on API schema
  statusOptions = [
    { value: 0, label: 'Scheduled' },
    { value: 1, label: 'In Progress' },
    { value: 2, label: 'Completed' },
    { value: 3, label: 'Cancelled' }
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
      status: [0, Validators.required] // Default to 0 (Scheduled)
    });
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadTrainers();

    this.trainingForm.get('province')?.valueChanges.subscribe(provinceName => {
      this.filterHospitals(provinceName);
    });
  }

  loadProvinces(): void {
    this.databaseService.getProvinces().subscribe({
      next: (provinces: any[]) => {
        this.provinces = provinces;
        console.log('Loaded provinces:', provinces);
      },
      error: (error: any) => {
        console.error('Error loading provinces:', error);
        this.toastr.error('Failed to load provinces', 'Error');
      }
    });
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

  filterHospitals(provinceName: string): void {
    if (!provinceName) {
      this.filteredHospitals = [];
      return;
    }

    // Map province names to hospitals - this should eventually use DatabaseService
    const hospitalsByProvince: { [key: string]: any[] } = {
      'Western Cape': [
        { id: 1, name: 'Groote Schuur Hospital', code: 'GSH001' },
        { id: 2, name: 'Tygerberg Hospital', code: 'TBH001' }
      ],
      'Gauteng': [
        { id: 3, name: 'Chris Hani Baragwanath Hospital', code: 'CHB001' },
        { id: 4, name: 'Charlotte Maxeke Hospital', code: 'CMJAH001' }
      ],
      'KwaZulu-Natal': [
        { id: 5, name: 'Inkosi Albert Luthuli Central Hospital', code: 'IALCH001' },
        { id: 6, name: 'King Edward VIII Hospital', code: 'KEH001' }
      ],
      'Eastern Cape': [
        { id: 7, name: 'Frere Hospital', code: 'FRH001' },
        { id: 8, name: 'Livingstone Hospital', code: 'LH001' }
      ],
      'Free State': [
        { id: 9, name: 'Universitas Academic Hospital', code: 'UAH001' },
        { id: 10, name: 'Pelonomi Hospital', code: 'PEL001' }
      ],
      'Limpopo': [
        { id: 11, name: 'Polokwane Hospital', code: 'POL001' },
        { id: 12, name: 'Mankweng Hospital', code: 'MAN001' }
      ],
      'Mpumalanga': [
        { id: 13, name: 'Rob Ferreira Hospital', code: 'RFH001' },
        { id: 14, name: 'Themba Hospital', code: 'THM001' }
      ],
      'North West': [
        { id: 15, name: 'Klerksdorp Hospital', code: 'KLK001' },
        { id: 16, name: 'Mafikeng Provincial Hospital', code: 'MAF001' }
      ],
      'Northern Cape': [
        { id: 17, name: 'Kimberley Hospital', code: 'KIM001' },
        { id: 18, name: 'Upington Hospital', code: 'UPI001' }
      ]
    };

    this.filteredHospitals = hospitalsByProvince[provinceName] || [];

    // Clear hospital selection when province changes
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
        startTime: this.formatTimeForAPI(formData.startTime),
        endTime: this.formatTimeForAPI(formData.endTime),
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
    this.trainingForm.get('status')?.setValue(0); // Reset to Scheduled
    this.filteredHospitals = [];
  }

  // Helper method to format date for API (ISO format)
  private formatDateForAPI(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  }

  // Helper method to format time for API (HH:mm:ss format)
  private formatTimeForAPI(timeString: string): string {
    if (!timeString) return '00:00:00';

    // If time is already in HH:mm format, add seconds
    if (timeString.length === 5) {
      return `${timeString}:00`;
    }

    // If time is already in HH:mm:ss format, return as-is
    return timeString;
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
