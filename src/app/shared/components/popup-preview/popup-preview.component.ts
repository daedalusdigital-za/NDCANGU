import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupPreviewService, PreviewData } from '../../../services/popup-preview/popup-preview.service';

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
      this.popupPreviewService.showPreview$.subscribe(show => {
        this.showPreview = show;
      })
    );

    this.subscriptions.push(
      this.popupPreviewService.previewData$.subscribe(data => {
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

  executeAction(action: any): void {
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