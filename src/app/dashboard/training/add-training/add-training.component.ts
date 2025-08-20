import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Province {
  name: string;
  code: string;
}

interface Hospital {
  name: string;
  code: string;
  province: string;
}

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  province: string;
  status: string;
}

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  isSubmitting = false;
  
  provinces: Province[] = [
    { name: 'Gauteng', code: 'GP' },
    { name: 'Western Cape', code: 'WC' },
    { name: 'KwaZulu-Natal', code: 'KZN' },
    { name: 'Eastern Cape', code: 'EC' },
    { name: 'Free State', code: 'FS' },
    { name: 'Limpopo', code: 'LP' },
    { name: 'Mpumalanga', code: 'MP' },
    { name: 'North West', code: 'NW' },
    { name: 'Northern Cape', code: 'NC' }
  ];

  hospitals: Hospital[] = [
    // Gauteng
    { name: 'Chris Hani Baragwanath Hospital', code: 'CHBH', province: 'GP' },
    { name: 'Charlotte Maxeke Hospital', code: 'CMH', province: 'GP' },
    { name: 'Helen Joseph Hospital', code: 'HJH', province: 'GP' },
    { name: 'Rahima Moosa Mother & Child Hospital', code: 'RMMCH', province: 'GP' },
    // Western Cape
    { name: 'Groote Schuur Hospital', code: 'GSH', province: 'WC' },
    { name: 'Tygerberg Hospital', code: 'TH', province: 'WC' },
    { name: 'Red Cross War Memorial Children\'s Hospital', code: 'RCWMCH', province: 'WC' },
    // KwaZulu-Natal
    { name: 'Inkosi Albert Luthuli Hospital', code: 'IALH', province: 'KZN' },
    { name: 'King Edward VIII Hospital', code: 'KEVIII', province: 'KZN' },
    { name: 'Addington Hospital', code: 'AH', province: 'KZN' },
    // Eastern Cape
    { name: 'Livingstone Hospital', code: 'LH', province: 'EC' },
    { name: 'Cecilia Makiwane Hospital', code: 'CMH', province: 'EC' },
    { name: 'Frere Hospital', code: 'FH', province: 'EC' },
    // Free State
    { name: 'Universitas Academic Hospital', code: 'UAH', province: 'FS' },
    { name: 'Pelonomi Hospital', code: 'PH', province: 'FS' },
    // Limpopo
    { name: 'Pietersburg Hospital', code: 'PH', province: 'LP' },
    { name: 'Mankweng Hospital', code: 'MH', province: 'LP' },
    // Mpumalanga
    { name: 'Rob Ferreira Hospital', code: 'RFH', province: 'MP' },
    { name: 'Witbank Hospital', code: 'WH', province: 'MP' },
    // North West
    { name: 'Klerksdorp Hospital', code: 'KH', province: 'NW' },
    { name: 'Mafikeng Provincial Hospital', code: 'MPH', province: 'NW' },
    // Northern Cape
    { name: 'Kimberley Hospital', code: 'KH', province: 'NC' },
    { name: 'Upington Hospital', code: 'UH', province: 'NC' }
  ];

  trainers: Trainer[] = [
    { id: 1, name: 'ZIBA', email: 'ziba@Promedtechnologies.co.za', phone: '+27721234567', province: 'Gauteng', status: 'Active' },
    { id: 2, name: 'LINDANI', email: 'lindani@Promedtechnologies.co.za', phone: '+27721234568', province: 'KwaZulu-Natal', status: 'Active' },
    { id: 3, name: 'KEHOLIHLE', email: 'keholihle@Promedtechnologies.co.za', phone: '+27721234569', province: 'Western Cape', status: 'Active' },
    { id: 4, name: 'SELBY', email: 'selby@Promedtechnologies.co.za', phone: '+27721234570', province: 'Eastern Cape', status: 'Active' },
    { id: 5, name: 'MASI', email: 'masi@Promedtechnologies.co.za', phone: '+27721234571', province: 'Limpopo', status: 'Active' },
    { id: 6, name: 'DYLAN', email: 'dylan@Promedtechnologies.co.za', phone: '+27721234572', province: 'Mpumalanga', status: 'Active' }
  ];

  filteredHospitals: Hospital[] = [];
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
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
      trainer: ['', Validators.required],
      numberOfParticipants: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      targetAudience: ['', Validators.required],
      objectives: [''],
      materials: [''],
      status: ['Planned', Validators.required]
    });
  }

  ngOnInit(): void {
    this.trainingForm.get('province')?.valueChanges.subscribe(provinceCode => {
      this.filterHospitals(provinceCode);
    });
  }

  filterHospitals(provinceCode: string): void {
    this.filteredHospitals = this.hospitals.filter(hospital => hospital.province === provinceCode);
    this.trainingForm.get('hospital')?.setValue('');
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      this.isSubmitting = true;
      
      const formData = this.trainingForm.value;
      const trainingData = {
        ...formData,
        id: Date.now(), // Generate temporary ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      setTimeout(() => {
        this.saveTrainingSession(trainingData);
      }, 2000);
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fill in all required fields correctly.', 'Form Error');
    }
  }

  private saveTrainingSession(trainingData: any): void {
    try {
      // In real implementation, this would be an API call
      console.log('Training session saved:', trainingData);
      
      this.toastr.success('Training session added successfully!', 'Success');
      this.isSubmitting = false;
      
      // Reset form
      this.trainingForm.reset();
      this.trainingForm.get('status')?.setValue('Planned');
      this.filteredHospitals = [];
      
      // Navigate to list view
      this.router.navigate(['/dashboard/training/list']);
      
    } catch (error) {
      console.error('Error saving training session:', error);
      this.toastr.error('Error saving training session. Please try again.', 'Error');
      this.isSubmitting = false;
    }
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
    this.trainingForm.reset();
    this.trainingForm.get('status')?.setValue('Planned');
    this.filteredHospitals = [];
    this.toastr.info('Form has been reset', 'Reset');
  }
}
