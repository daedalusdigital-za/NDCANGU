import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupPreviewService } from '../../../services/popup-preview/popup-preview.service';

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

@Component({
  selector: 'app-popup-preview',
  templateUrl: './popup-preview.component.html',
  styleUrls: ['./popup-preview.component.scss']
})
export class PopupPreviewComponent implements OnInit, OnDestroy {
  showPreview = false;
  previewData: PreviewData | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private popupPreviewService: PopupPreviewService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.popupPreviewService.showPreview$.subscribe((show: boolean) => {
        this.showPreview = show;
      })
    );

    this.subscriptions.push(
      this.popupPreviewService.previewData$.subscribe((data: PreviewData | null) => {
        this.previewData = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closePreview(): void {
    this.popupPreviewService.hidePreview();
  }

  executeAction(action: PreviewAction): void {
    action.action();
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-ZA');
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'active':
      case 'ready':
        return 'badge bg-success';
      case 'pending':
      case 'in-progress':
        return 'badge bg-warning';
      case 'failed':
      case 'inactive':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}