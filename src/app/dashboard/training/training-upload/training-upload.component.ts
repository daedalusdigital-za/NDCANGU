import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

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
  acceptedFileTypes = '.xlsx,.xls,.csv';

  // Upload dialog properties
  showUploadDialog = false;
  selectedFile: File | null = null;
  uploadInfo = {
    province: '',
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
      fileName: 'training_register_Q1_2024.xlsx',
      uploadDate: '2024-01-15 10:30',
      recordsProcessed: 45,
      status: 'Completed'
    },
    {
      fileName: 'training_register_Q2_2024.xlsx',
      uploadDate: '2024-04-20 14:15',
      recordsProcessed: 38,
      status: 'Completed'
    },
    {
      fileName: 'training_register_Q3_2024.xlsx',
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
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Invalid file type. Please upload Excel or CSV files only.', 'Invalid File Type');
      return false;
    }

    return true;
  }

  removeFile(index: number): void {
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

  downloadTemplate(): void {
    // Create sample template data
    const templateData = [
      {
        'Training Name': 'NCD Prevention Workshop',
        'Date': '2024-01-15',
        'Province': 'Gauteng',
        'Hospital': 'Chris Hani Baragwanath Hospital',
        'Trainer Name': 'Dr. Thabo Mthembu',
        'Number of Participants': 25
      },
      {
        'Training Name': 'Diabetes Management Course',
        'Date': '2024-01-20',
        'Province': 'Western Cape',
        'Hospital': 'Groote Schuur Hospital',
        'Trainer Name': 'Dr. Nomsa Dlamini',
        'Number of Participants': 18
      },
      {
        'Training Name': 'Hypertension Control Training',
        'Date': '2024-01-25',
        'Province': 'KwaZulu-Natal',
        'Hospital': 'Inkosi Albert Luthuli Hospital',
        'Trainer Name': 'Dr. Sipho Ndaba',
        'Number of Participants': 22
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Training Register Template');

    // Save the file
    XLSX.writeFile(wb, 'training_register_template.xlsx');

    this.toastr.success('Template downloaded successfully', 'Download Complete');
  }

  processTrainingRegister(file: File): void {
    // Show dialog to get upload information
    this.selectedFile = file;
    this.uploadInfo = {
      province: '',
      trainer: '',
      date: ''
    };
    this.showUploadDialog = true;
  }

  async confirmUpload(): Promise<void> {
    if (!this.selectedFile || !this.uploadInfo.province || !this.uploadInfo.trainer || !this.uploadInfo.date) {
      this.toastr.error('Please fill in all required fields', 'Missing Information');
      return;
    }

    try {
      this.showUploadDialog = false;
      this.toastr.info('Processing training register...', 'Processing');

      const data = await this.readExcelFile(this.selectedFile);
      const trainingRecords = this.parseTrainingData(data);

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
      this.toastr.error('Error processing training register. Please check the file format.', 'Processing Error');
      this.showUploadDialog = false;
    }
  }

  cancelUpload(): void {
    this.showUploadDialog = false;
    this.selectedFile = null;
    this.uploadInfo = {
      province: '',
      trainer: '',
      date: ''
    };
  }

  private readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  private parseTrainingData(data: any[]): TrainingRecord[] {
    const trainingRecords: TrainingRecord[] = [];

    data.forEach((row, index) => {
      try {
        const record: TrainingRecord = {
          trainingName: row['Training Name'] || row['trainingName'] || '',
          date: row['Date'] || row['date'] || '',
          province: row['Province'] || row['province'] || '',
          hospital: row['Hospital'] || row['hospital'] || '',
          trainerName: row['Trainer Name'] || row['trainerName'] || '',
          numberOfParticipants: parseInt(row['Number of Participants'] || row['numberOfParticipants'] || 0)
        };

        // Validate required fields
        if (record.trainingName && record.date && record.province && record.hospital) {
          trainingRecords.push(record);
        } else {
          console.warn(`Row ${index + 1}: Missing required fields`);
        }
      } catch (error) {
        console.error(`Error parsing row ${index + 1}:`, error);
      }
    });

    return trainingRecords;
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
