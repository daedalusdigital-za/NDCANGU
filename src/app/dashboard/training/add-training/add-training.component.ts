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
    
    this.trainingForm.get('province')?.valueChanges.subscribe(provinceCode => {
      this.filterHospitals(provinceCode);
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

  filterHospitals(provinceCode: string): void {
    if (!provinceCode) {
      this.filteredHospitals = [];
      return;
    }
    
    // Map province codes to hospitals - this should eventually use DatabaseService
    const hospitalsByProvince: { [key: string]: any[] } = {
      'WC': [
        { id: 1, name: 'Groote Schuur Hospital', code: 'GSH001' },
        { id: 2, name: 'Tygerberg Hospital', code: 'TBH001' }
      ],
      'GP': [
        { id: 3, name: 'Chris Hani Baragwanath Hospital', code: 'CHB001' },
        { id: 4, name: 'Charlotte Maxeke Hospital', code: 'CMJAH001' }
      ],
      'KZN': [
        { id: 5, name: 'Inkosi Albert Luthuli Central Hospital', code: 'IALCH001' },
        { id: 6, name: 'King Edward VIII Hospital', code: 'KEH001' }
      ],
      'EC': [
        { id: 7, name: 'Frere Hospital', code: 'FRH001' },
        { id: 8, name: 'Livingstone Hospital', code: 'LH001' }
      ],
      'FS': [
        { id: 9, name: 'Universitas Academic Hospital', code: 'UAH001' },
        { id: 10, name: 'Pelonomi Hospital', code: 'PEL001' }
      ],
      'LP': [
        { id: 11, name: 'Polokwane Hospital', code: 'POL001' },
        { id: 12, name: 'Mankweng Hospital', code: 'MAN001' }
      ],
      'MP': [
        { id: 13, name: 'Rob Ferreira Hospital', code: 'RFH001' },
        { id: 14, name: 'Themba Hospital', code: 'THM001' }
      ],
      'NW': [
        { id: 15, name: 'Klerksdorp Hospital', code: 'KLK001' },
        { id: 16, name: 'Mafikeng Provincial Hospital', code: 'MAF001' }
      ],
      'NC': [
        { id: 17, name: 'Kimberley Hospital', code: 'KIM001' },
        { id: 18, name: 'Upington Hospital', code: 'UPI001' }
      ]
    };
    
    this.filteredHospitals = hospitalsByProvince[provinceCode] || [];
    
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
