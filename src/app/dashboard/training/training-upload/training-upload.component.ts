import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface TrainingRecord {
  trainingName: string;
  date: string;
  province: string;
  hospital: string;
  trainerName: string;
  numberOfParticipants: number;
}

interface UploadHistory {
  fileName: string;
  uploadDate: string;
  recordsProcessed: number;
  status: string;
}

@Component({
  selector: 'app-training-upload',
  templateUrl: './training-upload.component.html',
  styleUrls: ['./training-upload.component.scss']
})
export class TrainingUploadComponent implements OnInit {

  uploadedFiles: File[] = [];
  maxFileSize = 5000000; // 5MB
  acceptedFileTypes = '.pdf';

  // Upload dialog properties
  showUploadDialog = false;
  selectedFile: File | null = null;
  uploadInfo = {
    province: '',
    venue: '',
    trainingId: '',
    trainer: '',
    date: ''
  };

  provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape'
  ];

  uploadHistory: UploadHistory[] = [
    {
      fileName: 'training_register_Q1_2024.pdf',
      uploadDate: '2024-01-15 10:30',
      recordsProcessed: 45,
      status: 'Completed'
    },
    {
      fileName: 'training_register_Q2_2024.pdf',
      uploadDate: '2024-04-20 14:15',
      recordsProcessed: 38,
      status: 'Completed'
    },
    {
      fileName: 'training_register_Q3_2024.pdf',
      uploadDate: '2024-07-10 09:45',
      recordsProcessed: 52,
      status: 'Processing'
    }
  ];

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  onUpload(event: any): void {
    const files = event.files;

    for (let file of files) {
      if (this.validateFile(file)) {
        this.uploadedFiles.push(file);
        this.toastr.success(`File ${file.name} uploaded successfully`, 'Success');
      }
    }
  }

  onError(event: any): void {
    this.toastr.error('Error uploading file. Please try again.', 'Upload Error');
  }

  validateFile(file: File): boolean {
    // Check file size
    if (file.size > this.maxFileSize) {
      this.toastr.error('File size exceeds 5MB limit', 'File Too Large');
      return false;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Invalid file type. Please upload PDF files only.', 'Invalid File Type');
      return false;
    }

    return true;
  }  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.toastr.info('File removed from upload queue', 'File Removed');
  }

  clearAll(): void {
    this.uploadedFiles = [];
    this.toastr.info('All files cleared from upload queue', 'Files Cleared');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  processTrainingRegister(file: File): void {
    // Show dialog to get upload information
    this.selectedFile = file;
    this.uploadInfo = {
      province: '',
      venue: '',
      trainingId: '',
      trainer: '',
      date: ''
    };
    this.showUploadDialog = true;
  }

  async confirmUpload(): Promise<void> {
    if (!this.selectedFile || !this.uploadInfo.province || !this.uploadInfo.venue ||
        !this.uploadInfo.trainingId || !this.uploadInfo.trainer || !this.uploadInfo.date) {
      this.toastr.error('Please fill in all required fields', 'Missing Information');
      return;
    }

    try {
      this.showUploadDialog = false;
      this.toastr.info('Processing training register PDF...', 'Processing');

      // For PDF files, we'll process them differently
      const trainingRecords = await this.processPdfFile(this.selectedFile);

      // Add upload info to each record
      trainingRecords.forEach(record => {
        record.province = this.uploadInfo.province;
        record.trainerName = this.uploadInfo.trainer;
        record.date = this.uploadInfo.date;
      });

      // Simulate processing
      await this.saveTrainingRecords(trainingRecords);

      this.toastr.success(`Successfully processed ${trainingRecords.length} training records`, 'Processing Complete');

      // Add to upload history
      this.uploadHistory.unshift({
        fileName: this.selectedFile.name,
        uploadDate: new Date().toLocaleString(),
        recordsProcessed: trainingRecords.length,
        status: 'Completed'
      });

      // Clear uploaded files
      this.uploadedFiles = [];
      this.selectedFile = null;

    } catch (error) {
      console.error('Error processing training register:', error);
      this.toastr.error('Error processing training register PDF. Please check the file format.', 'Processing Error');
      this.showUploadDialog = false;
    }
  }  cancelUpload(): void {
    this.showUploadDialog = false;
    this.selectedFile = null;
    this.uploadInfo = {
      province: '',
      venue: '',
      trainingId: '',
      trainer: '',
      date: ''
    };
  }

  private async processPdfFile(file: File): Promise<TrainingRecord[]> {
    return new Promise((resolve, reject) => {
      // For now, we'll simulate PDF processing
      // In a real implementation, you would use a PDF parsing library like pdf-parse

      setTimeout(() => {
        try {
          // Simulate extracted data from PDF
          const mockData: TrainingRecord[] = [
            {
              trainingName: 'NCD Prevention Workshop',
              date: this.uploadInfo.date,
              province: this.uploadInfo.province,
              hospital: 'Extracted from PDF',
              trainerName: this.uploadInfo.trainer,
              numberOfParticipants: 25
            },
            {
              trainingName: 'Diabetes Management Training',
              date: this.uploadInfo.date,
              province: this.uploadInfo.province,
              hospital: 'Extracted from PDF',
              trainerName: this.uploadInfo.trainer,
              numberOfParticipants: 18
            }
          ];

          resolve(mockData);
        } catch (error) {
          reject(error);
        }
      }, 1500); // Simulate processing time
    });
  }

  private async saveTrainingRecords(records: TrainingRecord[]): Promise<void> {
    // Simulate API call to save training records
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Training records saved:', records);
        resolve();
      }, 2000);
    });
  }

}
