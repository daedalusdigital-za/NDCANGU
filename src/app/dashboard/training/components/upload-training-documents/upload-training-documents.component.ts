import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { TrainingService, TrainingDocument } from '../../../../services/training/training.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-training-documents',
  templateUrl: './upload-training-documents.component.html',
  styleUrls: ['./upload-training-documents.component.scss']
})
export class UploadTrainingDocumentsComponent implements OnInit, OnChanges {
  @Input() trainingSessionId!: number;
  @Input() trainingSessionName!: string;
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onUploadSuccess = new EventEmitter<void>();

  // Upload form properties
  selectedFile: File | null = null;
  documentType: 'Register' | 'AttendanceSheet' | 'Materials' = 'Register';
  uploading = false;
  uploadProgress = 0;

  // Document types
  documentTypes = [
    { value: 'Register' as const, label: 'Registration Document', icon: 'fas fa-clipboard-list', color: 'primary' },
    { value: 'AttendanceSheet' as const, label: 'Attendance Sheet', icon: 'fas fa-users', color: 'success' },
    { value: 'Materials' as const, label: 'Training Materials', icon: 'fas fa-book', color: 'info' }
  ];

  // Existing documents
  existingDocuments: TrainingDocument[] = [];
  loadingDocuments = false;
  documentsLoadError = false;
  apiNotReady = false;

  // Authentication
  private authToken: string | null = null;

  constructor(
    private trainingService: TrainingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAuthToken();
    if (this.visible && this.trainingSessionId) {
      this.loadExistingDocuments();
    }
  }

  ngOnChanges(): void {
    if (this.visible && this.trainingSessionId) {
      this.loadExistingDocuments();
    }
  }

  /**
   * Load authentication token from localStorage
   */
  private loadAuthToken(): void {
    // Try multiple token storage formats for compatibility
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        this.authToken = user.token;
      } catch (error) {
        console.error('Error parsing currentUser from localStorage:', error);
      }
    }

    // Fallback to direct authToken storage
    if (!this.authToken) {
      this.authToken = localStorage.getItem('authToken');
    }

    if (!this.authToken) {
      console.error('No authentication token found. User must be logged in to upload documents.');
    }
  }

  /**
   * Load existing documents for the training session
   */
  private loadExistingDocuments(): void {
    if (!this.trainingSessionId) return;

    this.loadingDocuments = true;
    this.documentsLoadError = false;
    this.apiNotReady = false;

    this.trainingService.getSessionDocuments(this.trainingSessionId).subscribe({
      next: (documents) => {
        this.existingDocuments = documents;
        this.loadingDocuments = false;
        this.documentsLoadError = false;
        this.apiNotReady = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.existingDocuments = [];
        this.loadingDocuments = false;
        this.documentsLoadError = true;

        // Determine if this is likely an API deployment issue
        if (error.status === 400 || error.status === 404 || error.status === 500) {
          this.apiNotReady = true;
        }
      }
    });
  }

  /**
   * Retry loading documents
   */
  retryLoadDocuments(): void {
    this.loadExistingDocuments();
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      this.selectedFile = null;
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      this.toastr.error('Only PDF files are allowed', 'Invalid File Type');
      this.selectedFile = null;
      target.value = '';
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      this.toastr.error('File size must be less than 10MB', 'File Too Large');
      this.selectedFile = null;
      target.value = '';
      return;
    }

    this.selectedFile = file;
  }

  /**
   * Upload the selected file
   */
  uploadFile(): void {
    if (!this.selectedFile || !this.trainingSessionId || !this.authToken) {
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    this.trainingService.uploadPDF(
      this.trainingSessionId,
      this.selectedFile,
      this.documentType,
      this.authToken
    ).subscribe({
      next: (response) => {
        this.uploading = false;
        this.uploadProgress = 100;
        this.toastr.success('Document uploaded successfully', 'Upload Complete');

        // Reset form
        this.selectedFile = null;
        this.documentType = 'Register';
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        // Reload documents to show the newly uploaded file
        this.loadExistingDocuments();

        // Emit success event
        this.onUploadSuccess.emit();
      },
      error: (error) => {
        this.uploading = false;
        this.uploadProgress = 0;
        console.error('Upload error:', error);

        // Use enhanced error message from service if available
        let errorMessage = error.userMessage || 'Upload failed. Please try again.';

        // Fallback to status-based messages if no userMessage
        if (!error.userMessage) {
          if (error.status === 401) {
            errorMessage = 'Authentication failed. Please login again.';
          } else if (error.status === 413) {
            errorMessage = 'File is too large. Maximum size is 10MB.';
          } else if (error.status === 400) {
            errorMessage = 'Invalid file or request. Please check file format and size.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
        }

        this.toastr.error(errorMessage, 'Upload Failed');
      }
    });
  }

  /**
   * Download a document
   */
  downloadDocument(document: TrainingDocument): void {
    this.trainingService.downloadPDF(document.id, document.originalFileName);
  }

  /**
   * Delete a document
   */
  deleteDocument(document: TrainingDocument): void {
    if (!this.authToken) {
      this.toastr.error('Authentication required to delete documents', 'Error');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${document.originalFileName}"?`)) {
      return;
    }

    this.trainingService.deleteDocument(document.id, this.authToken).subscribe({
      next: () => {
        this.toastr.success('Document deleted successfully', 'Success');
        this.loadExistingDocuments();
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.toastr.error('Failed to delete document', 'Error');
      }
    });
  }

  /**
   * Get document type configuration
   */
  getDocumentTypeConfig(type: string) {
    return this.documentTypes.find(dt => dt.value === type) || this.documentTypes[0];
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    return this.trainingService.formatFileSize(bytes);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Close the modal
   */
  closeModal(): void {
    // Reset form state
    this.selectedFile = null;
    this.documentType = 'Register';
    this.uploading = false;
    this.uploadProgress = 0;

    // Clear file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.onClose.emit();
  }

  /**
   * Check if upload is valid
   */
  get canUpload(): boolean {
    return !!(this.selectedFile && this.trainingSessionId && this.authToken && !this.uploading);
  }

  /**
   * Set document type
   */
  setDocumentType(type: 'Register' | 'AttendanceSheet' | 'Materials'): void {
    this.documentType = type;
  }
  get hasAuthToken(): boolean {
    return !!this.authToken;
  }

  /**
   * Get upload button text
   */
  get uploadButtonText(): string {
    if (this.uploading) return 'Uploading...';
    if (!this.authToken) return 'Login Required';
    if (!this.selectedFile) return 'Select File First';
    return 'Upload Document';
  }
}
