import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService, TrainingStatus } from '../../../services/data/database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Trainer {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  province?: string;
  location?: string;
  status?: string;
  qualification?: string;
  experience?: number;
  bio?: string;
}

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  isSubmitting = false;

  // File upload properties
  @ViewChild('trainingRegisterFile') trainingRegisterFile: ElementRef | null = null;
  showUploadDialog = false;
  selectedFile: File | null = null;
  uploadInfo = {
    province: '',
    venue: '',
    trainer: '',
    date: ''
  };

  // Province mapping with IDs matching backend
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

  hospitals: any[] = [];
  trainers: any[] = [];
  filteredHospitals: any[] = [];
  trainingTypes = [
    'NDC Training workshop',
    'Virtual training'
  ];

  // Status options based on TrainingStatus enum
  statusOptions = [
    { value: TrainingStatus.Planned, label: 'Planned' },
    { value: TrainingStatus.Scheduled, label: 'Scheduled' },
    { value: TrainingStatus.InProgress, label: 'In Progress' },
    { value: TrainingStatus.Completed, label: 'Completed' },
    { value: TrainingStatus.Cancelled, label: 'Cancelled' }
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
      trainingDate: ['', Validators.required],
      provinceId: ['', Validators.required],
      venue: ['', Validators.required],
      trainerId: ['', Validators.required],
      targetAudience: ['', Validators.required],
      numberOfParticipants: ['', [Validators.required, Validators.min(1), Validators.max(500)]],
      status: [TrainingStatus.Planned, Validators.required] // Default to Planned
    });
  }

  ngOnInit(): void {
    this.loadTrainers();

    this.trainingForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      const province = this.provinces.find(p => p.id === provinceId);
      if (province) {
        this.filterHospitals(province.name);
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

      // Convert form data to match the API schema
      const trainingSession = {
        trainingName: formData.trainingName,
        trainingType: formData.trainingType,
        trainingDate: this.formatDateForAPI(formData.trainingDate),
        provinceId: parseInt(formData.provinceId),
        venue: formData.venue,
        trainerId: parseInt(formData.trainerId),
        targetAudience: formData.targetAudience,
        numberOfParticipants: parseInt(formData.numberOfParticipants),
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
    this.trainingForm.get('status')?.setValue(TrainingStatus.Planned); // Reset to Planned
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

  // File Upload Methods
  onTrainingRegisterFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (file.type !== 'application/pdf') {
        this.toastr.error('Please select a PDF file', 'Invalid File');
        return;
      }

      // Validate file size (5MB)
      const maxFileSize = 5000000;
      if (file.size > maxFileSize) {
        this.toastr.error('File size cannot exceed 5MB', 'File Too Large');
        return;
      }

      this.selectedFile = file;
      // Reset upload info and open modal
      this.uploadInfo = {
        province: '',
        venue: '',
        trainer: '',
        date: ''
      };
      this.showUploadDialog = true;
    }
  }

  cancelUpload(): void {
    this.showUploadDialog = false;
    this.selectedFile = null;
    this.uploadInfo = {
      province: '',
      venue: '',
      trainer: '',
      date: ''
    };
  }

  confirmUpload(): void {
    // Validate all fields are filled
    if (!this.uploadInfo.province || !this.uploadInfo.venue || !this.uploadInfo.trainer || !this.uploadInfo.date) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return;
    }

    if (!this.selectedFile) {
      this.toastr.error('No file selected', 'Error');
      return;
    }

    // Process the upload
    this.processTrainingRegisterUpload();
  }

  private processTrainingRegisterUpload(): void {
    if (!this.selectedFile) {
      return;
    }

    console.log('Processing Training Register:', {
      file: this.selectedFile.name,
      uploadInfo: this.uploadInfo
    });

    // Show success message
    this.toastr.success(`Training register '${this.selectedFile.name}' uploaded successfully`, 'Upload Complete');

    // Close modal
    this.showUploadDialog = false;

    // Optionally, you can extract data from PDF and populate form fields
    // For now, just populate the venue field from the modal
    this.trainingForm.get('venue')?.setValue(this.uploadInfo.venue);

    // Reset file input
    if (this.trainingRegisterFile) {
      this.trainingRegisterFile.nativeElement.value = '';
    }
    this.selectedFile = null;
  }
}
