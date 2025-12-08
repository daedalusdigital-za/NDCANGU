import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../services/data/database.service';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss']
})
export class EditTrainingComponent implements OnInit, OnChanges {
  @Input() trainingId: number = 0;
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();
  training: any = {
    id: 0,
    trainingName: '',
    trainingType: '',
    trainingDate: '',
    startDate: '',
    endDate: '',
    provinceId: null,
    provinceName: '',
    venue: '',
    trainerId: null,
    trainerName: '',
    targetAudience: '',
    numberOfParticipants: 0,
    status: 1,
    statusText: '',
    hospital: '',
    trainingObjectives: '',
    trainingMaterials: '',
    dateCreated: null,
    lastUpdated: null,
    createdByUserName: ''
  };

  trainers: any[] = [];
  isLoading = false;
  isSubmitting = false;
  errorLoading = false;

  // Document upload properties
  selectedDocumentType: string = '';
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  trainingDocuments: any[] = [];

  // Status options
  statusOptions = [
    { value: 1, label: 'Scheduled' },
    { value: 2, label: 'In Progress' },
    { value: 3, label: 'Completed' },
    { value: 4, label: 'Cancelled' },
    { value: 5, label: 'Planned' }
  ];

  // Province options with correct API IDs
  provinces = [
    { id: 1, name: 'Eastern Cape' },
    { id: 2, name: 'Free State' },
    { id: 3, name: 'Gauteng' },
    { id: 4, name: 'KwaZulu-Natal' },
    { id: 5, name: 'Limpopo' },
    { id: 6, name: 'Mpumalanga' },
    { id: 7, name: 'Northern Cape' },
    { id: 8, name: 'North West' },
    { id: 9, name: 'Western Cape' }
  ];

  // Training type options (matching API specification)
  trainingTypes = [
    'NDC Training Workshop',
    'Virtual Training',
    'Workshop',
    'Seminar',
    'Conference',
    'Training Session'
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
    private toastr: ToastrService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.loadTrainers();
    this.loadTrainingDocuments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trainingId'] && this.trainingId > 0) {
      this.loadTrainingSession();
    }
  }

  loadTrainers(): void {
    this.databaseService.getTrainers().subscribe({
      next: (trainers) => {
        // Filter for active trainers and ensure proper name formatting
        this.trainers = trainers.filter(t => t.isActive === true || t.status === 'Active').map(trainer => {
          // Ensure name is computed from firstName + lastName if not already present
          if (!trainer.name && trainer.firstName && trainer.lastName) {
            trainer.name = `${trainer.firstName} ${trainer.lastName}`;
          }
          return trainer;
        });
        console.log('Loaded trainers:', this.trainers);
        console.log('Number of active trainers:', this.trainers.length);
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.toastr.error('Failed to load trainers', 'Error');
      }
    });
  }

  onProvinceChange(): void {
    // Update provinceName when provinceId changes
    if (this.training.provinceId) {
      const province = this.provinces.find(p => p.id == this.training.provinceId);
      if (province) {
        this.training.provinceName = province.name;
        console.log('Province changed to:', province.name, 'ID:', this.training.provinceId);
      }
    } else {
      this.training.provinceName = '';
    }

    // Reload trainers for the new province
    this.loadTrainersByProvince();
  }

  loadTrainersByProvince(): void {
    if (this.training.provinceId) {
      // Set provinceName based on selected province ID if not already set
      if (!this.training.provinceName) {
        const province = this.provinces.find(p => p.id == this.training.provinceId);
        if (province) {
          this.training.provinceName = province.name;
        }
      }

      // Load all trainers (production API doesn't filter by province)
      this.databaseService.getTrainers().subscribe({
        next: (trainers) => {
          // Filter for active trainers and ensure proper name formatting
          this.trainers = trainers.filter(t => t.isActive === true || t.status === 'Active').map(trainer => {
            // Ensure name is computed from firstName + lastName if not already present
            if (!trainer.name && trainer.firstName && trainer.lastName) {
              trainer.name = `${trainer.firstName} ${trainer.lastName}`;
            }
            return trainer;
          });

          console.log('Loaded trainers for province ID:', this.training.provinceId, this.trainers);

          // Preserve current trainer selection if it exists
          if (this.training.trainerId) {
            const currentTrainerExists = this.trainers.some(t => t.id === this.training.trainerId);
            if (!currentTrainerExists) {
              console.warn('Current trainer not found in loaded trainers');
            }
          }
        },
        error: (error) => {
          console.error('Error loading trainers for province:', error);
          this.toastr.error('Failed to load trainers for selected province', 'Error');
        }
      });
    } else {
      // Load all trainers if no province selected
      this.loadTrainers();
    }
  }

  loadTrainingSession(): void {
    this.isLoading = true;
    this.databaseService.getTrainingSessionById(this.trainingId).subscribe({
      next: (session) => {
        this.training = { ...session };

        // Map the trainingDate field from API to form fields
        if (session.trainingDate) {
          this.training.startDate = this.formatDateForInput(session.trainingDate);
          this.training.endDate = this.formatDateForInput(session.trainingDate);
        }

        // Set the trainerId for the dropdown selection
        if (session.trainerId) {
          this.training.trainerId = Number(session.trainerId);
          console.log('Set trainerId from session:', this.training.trainerId, typeof this.training.trainerId);
        }

        // Handle display names from API
        if ((session as any).provinceName) {
          this.training.provinceName = (session as any).provinceName;
          // Set the provinceId based on the province name
          const province = this.provinces.find(p => p.name === (session as any).provinceName);
          if (province) {
            this.training.provinceId = province.id;
            console.log('Set province:', province.name, 'ID:', this.training.provinceId);
          }
        }

        // If session has provinceId directly, use it
        if (session.provinceId) {
          this.training.provinceId = Number(session.provinceId);
          const province = this.provinces.find(p => p.id === this.training.provinceId);
          if (province) {
            this.training.provinceName = province.name;
            console.log('Set province from ID:', province.name, 'ID:', this.training.provinceId);
          }
        }

        // Load trainers after setting province
        this.loadTrainersByProvince();

        if ((session as any).trainerName) {
          this.training.trainerName = (session as any).trainerName;
        }

        console.log('Loaded training session:', this.training);
        console.log('TrainerId set to:', this.training.trainerId);
        console.log('API returned trainingDate:', session.trainingDate);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading training session:', error);
        this.toastr.error('Failed to load training session', 'Error');
        this.onClose.emit();
      }
    });
  }

  updateTraining(): void {
    if (this.validateForm()) {
      this.isSubmitting = true;

      // Prepare the data according to TrainingSessionModel API specification
      const updateData = {
        id: Number(this.training.id),
        trainingName: this.training.trainingName,
        trainingType: this.training.trainingType,
        trainingDate: this.training.startDate ? this.training.startDate + 'T08:00:00' : new Date().toISOString(),
        provinceId: Number(this.training.provinceId),
        venue: this.training.venue,
        trainerId: this.training.trainerId ? Number(this.training.trainerId) : null,
        targetAudience: this.training.targetAudience,
        numberOfParticipants: Number(this.training.numberOfParticipants) || 0,
        status: Number(this.training.status),
        hospital: this.training.hospital || '',
        trainingObjectives: this.training.trainingObjectives || '',
        trainingMaterials: this.training.trainingMaterials || ''
      };

      console.log('Updating training session with data:', updateData);
      console.log('TrainerId being sent:', updateData.trainerId, 'ProvinceId being sent:', updateData.provinceId);

      this.databaseService.updateTrainingSession(updateData).subscribe({
        next: (result) => {
          console.log('Backend response:', result);
          this.isSubmitting = false;
          this.toastr.success('Training session updated successfully!', 'Success');
          this.onSave.emit(result);
          this.cancel();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating training session:', error);
          this.toastr.error('Failed to update training session. Please check all required fields.', 'Error');
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.training.trainingName || this.training.trainingName.trim() === '') {
      this.toastr.error('Training name is required', 'Validation Error');
      return false;
    }

    if (!this.training.startDate) {
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
    this.onClose.emit();
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Document Upload Methods
  onFileSelect(event: any): void {
    const files = event.files || event.currentFiles;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (file.type !== 'application/pdf') {
        this.toastr.error('Only PDF files are allowed', 'Invalid File Type');
        this.selectedFile = null;
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10000000) {
        this.toastr.error('File size must be less than 10MB', 'File Too Large');
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    }
  }  onFileClear(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  uploadDocument(event: any): void {
    if (!this.selectedFile || !this.selectedDocumentType) {
      this.toastr.error('Please select a document type and file', 'Upload Error');
      return;
    }

    if (!this.trainingId) {
      this.toastr.error('Training session must be saved before uploading documents', 'Upload Error');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('trainingSessionId', this.trainingId.toString());
    formData.append('documentType', this.selectedDocumentType);
    formData.append('fileName', this.selectedFile.name);

    this.uploadProgress = 0;

    // Use real API call when backend is ready
    // this.databaseService.uploadTrainingDocument(formData).subscribe({
    //   next: (response) => {
    //     this.uploadProgress = 100;
    //     this.trainingDocuments.push(response);
    //     this.toastr.success('Document uploaded successfully', 'Success');
    //     this.resetUploadForm();
    //   },
    //   error: (error) => {
    //     this.uploadProgress = 0;
    //     this.toastr.error('Failed to upload document', 'Error');
    //   }
    // });

    // For now, simulate the upload
    this.simulateUpload();
  }  private simulateUpload(): void {
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.uploadProgress = 100;

        // Add to documents list
        const newDocument = {
          id: Date.now(), // temporary ID
          fileName: this.selectedFile?.name,
          documentType: this.selectedDocumentType,
          fileSize: this.selectedFile?.size,
          uploadDate: new Date().toISOString()
        };

        this.trainingDocuments.push(newDocument);
        this.toastr.success('Document uploaded successfully', 'Success');

        // Reset form
        this.resetUploadForm();
      }
    }, 200);
  }

  private resetUploadForm(): void {
    this.selectedFile = null;
    this.selectedDocumentType = '';
    this.uploadProgress = 0;
  }

  downloadDocument(document: any): void {
    // Use real API when backend is ready
    // this.databaseService.downloadTrainingDocument(document.id).subscribe({
    //   next: (blob: Blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = document.fileName;
    //     link.click();
    //     window.URL.revokeObjectURL(url);
    //   },
    //   error: (error) => {
    //     this.toastr.error('Failed to download document', 'Error');
    //   }
    // });

    // For now, show info message
    this.toastr.info('Document download will be available when connected to backend API', 'Info');
  }

  deleteDocument(document: any): void {
    if (confirm('Are you sure you want to delete this document?')) {
      // Use real API when backend is ready
      // this.databaseService.deleteTrainingDocument(document.id).subscribe({
      //   next: () => {
      //     const index = this.trainingDocuments.findIndex(doc => doc.id === document.id);
      //     if (index > -1) {
      //       this.trainingDocuments.splice(index, 1);
      //     }
      //     this.toastr.success('Document deleted successfully', 'Success');
      //   },
      //   error: (error) => {
      //     this.toastr.error('Failed to delete document', 'Error');
      //   }
      // });

      // For now, remove from local array
      const index = this.trainingDocuments.findIndex(doc => doc.id === document.id);
      if (index > -1) {
        this.trainingDocuments.splice(index, 1);
        this.toastr.success('Document deleted successfully', 'Success');
      }
    }
  }  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  loadTrainingDocuments(): void {
    if (!this.trainingId) return;

    // Use real API when backend is ready
    // this.databaseService.getTrainingDocuments(this.trainingId).subscribe({
    //   next: (documents) => {
    //     this.trainingDocuments = documents || [];
    //   },
    //   error: (error) => {
    //     console.error('Error loading training documents:', error);
    //     this.trainingDocuments = [];
    //   }
    // });

    // For now, start with empty array
    this.trainingDocuments = [];
  }
}
