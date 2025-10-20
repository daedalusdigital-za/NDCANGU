import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PreviewData {
  title: string;
  content: any;
  type: 'register' | 'report' | 'trainer' | 'generic';
  actions?: PreviewAction[];
}

export interface PreviewAction {
  label: string;
  icon: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class PopupPreviewService {
  private previewDataSubject = new BehaviorSubject<PreviewData | null>(null);
  private showPreviewSubject = new BehaviorSubject<boolean>(false);

  previewData$ = this.previewDataSubject.asObservable();
  showPreview$ = this.showPreviewSubject.asObservable();

  constructor() { }

  showPreview(data: PreviewData): void {
    this.previewDataSubject.next(data);
    this.showPreviewSubject.next(true);
  }

  hidePreview(): void {
    this.showPreviewSubject.next(false);
    setTimeout(() => {
      this.previewDataSubject.next(null);
    }, 300); // Wait for animation to complete
  }

  // Specific preview methods for different data types
  showRegisterPreview(register: any): void {
    this.showPreview({
      title: `Training Register - ${register.courseName}`,
      content: register,
      type: 'register',
      actions: [
        {
          label: 'Download',
          icon: 'fas fa-download',
          action: () => this.downloadRegister(register),
          variant: 'primary'
        },
        {
          label: 'Close',
          icon: 'fas fa-times',
          action: () => this.hidePreview(),
          variant: 'secondary'
        }
      ]
    });
  }

  showReportPreview(report: any): void {
    this.showPreview({
      title: `Training Report - ${report.title}`,
      content: report,
      type: 'report',
      actions: [
        {
          label: 'Download',
          icon: 'fas fa-download',
          action: () => this.downloadReport(report),
          variant: 'primary'
        },
        {
          label: 'Close',
          icon: 'fas fa-times',
          action: () => this.hidePreview(),
          variant: 'secondary'
        }
      ]
    });
  }

  showTrainerPreview(trainer: any): void {
    this.showPreview({
      title: `Trainer Profile - ${trainer.name}`,
      content: trainer,
      type: 'trainer',
      actions: [
        {
          label: 'Edit',
          icon: 'fas fa-edit',
          action: () => this.editTrainer(trainer),
          variant: 'warning'
        },
        {
          label: 'Contact',
          icon: 'fas fa-envelope',
          action: () => this.contactTrainer(trainer),
          variant: 'info'
        },
        {
          label: 'Close',
          icon: 'fas fa-times',
          action: () => this.hidePreview(),
          variant: 'secondary'
        }
      ]
    });
  }

  // Helper methods (these would typically call other services)
  private downloadRegister(register: any): void {
    // Implementation would go here
    console.log('Downloading register:', register);
    this.hidePreview();
  }

  private downloadReport(report: any): void {
    // Implementation would go here
    console.log('Downloading report:', report);
    this.hidePreview();
  }

  private editTrainer(trainer: any): void {
    // Implementation would go here
    console.log('Editing trainer:', trainer);
    this.hidePreview();
  }

  private contactTrainer(trainer: any): void {
    // Implementation would go here
    console.log('Contacting trainer:', trainer);
    this.hidePreview();
  }
}