import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupPreviewService } from '../../../services/popup-preview/popup-preview.service';

interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  province: string;
  qualification: string;
  experience: number;
  status: string;
  location: string;
  bio: string;
}

interface TrainingRegister {
  id: number;
  sessionTitle: string;
  trainer: string;
  date: string;
  venue: string;
  participants: number;
  duration: string;
  status: string;
  topic: string;
  attendanceRate: number;
  certificatesIssued: number;
  registerFile?: string;
}

interface TrainingReport {
  id: number;
  reportType: string;
  generatedDate: string;
  status: string;
  period: string;
  totalSessions: number;
  totalParticipants: number;
  completionRate: number;
}

@Component({
  selector: 'app-training-reports',
  templateUrl: './training-reports.component.html',
  styleUrls: ['./training-reports.component.scss']
})
export class TrainingReportsComponent implements OnInit {

  trainers: Trainer[] = [];
  trainingRegisters: TrainingRegister[] = [];
  trainingReports: TrainingReport[] = [];
  activeTrainersCount: number = 0;
  totalSessions: number = 0;
  totalParticipants: number = 0;
  averageAttendanceRate: number = 0;
  selectedTab: string = 'registers';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private popupPreviewService: PopupPreviewService
  ) { }

  ngOnInit(): void {
    this.loadTrainers();
    this.loadTrainingRegisters();
    this.loadTrainingReports();
    this.calculateStatistics();
  }

  // Load trainers data and calculate active count
  loadTrainers(): void {
    this.trainers = [
      {
        id: 1,
        name: 'ZIBA',
        email: 'ziba@Promedtechnologies.co.za',
        phone: '+27721234567',
        province: 'Gauteng',
        qualification: 'MD',
        experience: 8,
        status: 'Active',
        location: 'Johannesburg',
        bio: 'Experienced medical trainer with focus on community health'
      },
      {
        id: 2,
        name: 'LINDANI',
        email: 'lindani@Promedtechnologies.co.za',
        phone: '+27721234568',
        province: 'KwaZulu-Natal',
        qualification: 'MD, PhD',
        experience: 12,
        status: 'Active',
        location: 'Durban',
        bio: 'Medical specialist with extensive training background'
      },
      {
        id: 3,
        name: 'KEHOLIHLE',
        email: 'keholihle@Promedtechnologies.co.za',
        phone: '+27721234569',
        province: 'Western Cape',
        qualification: 'MD, MSc',
        experience: 6,
        status: 'Active',
        location: 'Cape Town',
        bio: 'Community health advocate specializing in medical training'
      },
      {
        id: 4,
        name: 'SELBY',
        email: 'selby@Promedtechnologies.co.za',
        phone: '+27721234570',
        province: 'Eastern Cape',
        qualification: 'MD',
        experience: 10,
        status: 'Active',
        location: 'Port Elizabeth',
        bio: 'Medical trainer with focus on rural health programs'
      },
      {
        id: 5,
        name: 'MASI',
        email: 'masi@Promedtechnologies.co.za',
        phone: '+27721234571',
        province: 'Limpopo',
        qualification: 'MD, MSc',
        experience: 7,
        status: 'Active',
        location: 'Polokwane',
        bio: 'Healthcare professional with training expertise'
      },
      {
        id: 6,
        name: 'DYLAN',
        email: 'dylan@Promedtechnologies.co.za',
        phone: '+27721234572',
        province: 'Mpumalanga',
        qualification: 'MD',
        experience: 5,
        status: 'Active',
        location: 'Nelspruit',
        bio: 'Medical professional specializing in training programs'
      }
    ];

    // Calculate active trainers count
    this.activeTrainersCount = this.trainers.filter(trainer => trainer.status === 'Active').length;
  }

  // Load training registers data
  loadTrainingRegisters(): void {
    this.trainingRegisters = [
      {
        id: 1,
        sessionTitle: 'Medical Equipment Operation Training',
        trainer: 'ZIBA',
        date: '2024-01-15',
        venue: 'Johannesburg Medical Center',
        participants: 25,
        duration: '4 hours',
        status: 'Completed',
        topic: 'Medical Equipment',
        attendanceRate: 96,
        certificatesIssued: 24,
        registerFile: 'register_001.pdf'
      },
      {
        id: 2,
        sessionTitle: 'Healthcare Safety Protocols',
        trainer: 'LINDANI',
        date: '2024-01-22',
        venue: 'Durban Health Training Center',
        participants: 30,
        duration: '6 hours',
        status: 'Completed',
        topic: 'Safety Protocols',
        attendanceRate: 93,
        certificatesIssued: 28,
        registerFile: 'register_002.pdf'
      },
      {
        id: 3,
        sessionTitle: 'Emergency Response Training',
        trainer: 'KEHOLIHLE',
        date: '2024-02-05',
        venue: 'Cape Town Medical Institute',
        participants: 28,
        duration: '8 hours',
        status: 'Completed',
        topic: 'Emergency Response',
        attendanceRate: 100,
        certificatesIssued: 28,
        registerFile: 'register_003.pdf'
      },
      {
        id: 4,
        sessionTitle: 'Patient Care Standards',
        trainer: 'SELBY',
        date: '2024-02-12',
        venue: 'Port Elizabeth Health Hub',
        participants: 22,
        duration: '5 hours',
        status: 'Completed',
        topic: 'Patient Care',
        attendanceRate: 91,
        certificatesIssued: 20,
        registerFile: 'register_004.pdf'
      },
      {
        id: 5,
        sessionTitle: 'Medical Device Maintenance',
        trainer: 'MASI',
        date: '2024-02-20',
        venue: 'Polokwane Training Facility',
        participants: 18,
        duration: '6 hours',
        status: 'In Progress',
        topic: 'Device Maintenance',
        attendanceRate: 89,
        certificatesIssued: 0
      },
      {
        id: 6,
        sessionTitle: 'Healthcare Administration',
        trainer: 'DYLAN',
        date: '2024-03-01',
        venue: 'Nelspruit Medical Center',
        participants: 35,
        duration: '4 hours',
        status: 'Scheduled',
        topic: 'Administration',
        attendanceRate: 0,
        certificatesIssued: 0
      }
    ];
  }

  // Load training reports data
  loadTrainingReports(): void {
    this.trainingReports = [
      {
        id: 1,
        reportType: 'Monthly Training Summary',
        generatedDate: '2024-01-31',
        status: 'Ready',
        period: 'January 2024',
        totalSessions: 15,
        totalParticipants: 375,
        completionRate: 92
      },
      {
        id: 2,
        reportType: 'Quarterly Training Report',
        generatedDate: '2024-03-31',
        status: 'Processing',
        period: 'Q1 2024',
        totalSessions: 45,
        totalParticipants: 1125,
        completionRate: 89
      },
      {
        id: 3,
        reportType: 'Annual Training Overview',
        generatedDate: '2023-12-31',
        status: 'Ready',
        period: '2023',
        totalSessions: 169,
        totalParticipants: 4225,
        completionRate: 94
      }
    ];
  }

  // Calculate training statistics
  calculateStatistics(): void {
    const completedRegisters = this.trainingRegisters.filter(register => register.status === 'Completed');
    this.totalSessions = this.trainingRegisters.length;
    this.totalParticipants = this.trainingRegisters.reduce((sum, register) => sum + register.participants, 0);
    
    if (completedRegisters.length > 0) {
      this.averageAttendanceRate = Math.round(
        completedRegisters.reduce((sum, register) => sum + register.attendanceRate, 0) / completedRegisters.length
      );
    }
  }

  // Switch between tabs
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  // View register details
  viewRegister(register: TrainingRegister): void {
    const registerData = {
      title: register.sessionTitle,
      trainer: register.trainer,
      date: register.date,
      venue: register.venue,
      participants: register.participants,
      duration: register.duration,
      status: register.status,
      topic: register.topic,
      attendanceRate: register.attendanceRate,
      certificatesIssued: register.certificatesIssued,
      description: `Training session "${register.sessionTitle}" conducted by ${register.trainer} on ${register.date}. This session was held at ${register.venue} with ${register.participants} participants.`
    };
    
    this.popupPreviewService.showRegisterPreview(registerData);
  }

  // Download register file
  downloadRegister(register: TrainingRegister): void {
    if (register.registerFile) {
      this.toastr.success(`Downloading ${register.registerFile}`, 'Download Started');
    } else {
      this.toastr.warning('No register file available', 'Download');
    }
  }

  // Generate new report
  generateReport(reportType: string): void {
    this.toastr.info(`Generating ${reportType} report...`, 'Report Generation');
  }

  // View report details
  viewReport(report: TrainingReport): void {
    const reportData = {
      title: `${report.reportType} - ${report.period}`,
      type: report.reportType,
      generatedDate: report.generatedDate,
      status: report.status,
      period: report.period,
      totalSessions: report.totalSessions,
      totalParticipants: report.totalParticipants,
      completionRate: report.completionRate,
      description: `This ${report.reportType.toLowerCase()} covers the period of ${report.period} and includes ${report.totalSessions} training sessions with ${report.totalParticipants} total participants, achieving a ${report.completionRate}% completion rate.`
    };
    
    this.popupPreviewService.showReportPreview(reportData);
  }

  // Download report
  downloadReport(report: TrainingReport): void {
    this.toastr.success(`Downloading ${report.reportType}`, 'Download Started');
  }

}
