import { Component, OnInit, inject } from '@angular/core';
import { TrainingService, TrainingSession } from '../../../services/training/training.service';
import { DatabaseService, Province } from '../../../services/data/database.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-training-sessions-list',
  templateUrl: './training-sessions-list.component.html',
  styleUrls: ['./training-sessions-list.component.scss']
})
export class TrainingSessionsListComponent implements OnInit {
  private trainingService = inject(TrainingService);
  private databaseService = inject(DatabaseService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  sessions: TrainingSession[] = [];
  displayedSessions: TrainingSession[] = [];

  // Provinces list from API/fallback
  provinces: Province[] = [];

  loading = false;
  error: string | null = null;
  filterProvince = '';
  filterStatus = '';
  searchTerm = '';

  // Modal properties
  showEditModal = false;
  editingTrainingId = 0;
  showUploadModal = false;
  uploadingSessionId = 0;
  uploadingSessionName = '';

  displayedColumns: string[] = [
    'trainingName',
    'trainingType',
    'startDate',
    'endDate',
    'province',
    'venue',
    'trainer',
    'participants',
    'status',
    'actions'
  ];

  ngOnInit(): void {
    this.loadProvinces();
    this.loadAllSessions();
  }

  /**
   * Load all provinces
   */
  loadProvinces(): void {
    this.databaseService.getProvinces().subscribe({
      next: (provinces) => {
        this.provinces = provinces;
        console.log('✅ Loaded', provinces.length, 'provinces');
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  /**
   * Load all training sessions
   */
  loadAllSessions(): void {
    this.loading = true;
    this.error = null;

    this.trainingService.getAllSessions().subscribe({
      next: (data: TrainingSession[]) => {
        this.sessions = data;
        this.sessions.forEach(session => {
          session.statusText = this.trainingService.getStatusText(session.status);
        });
        this.applyFilters();
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = 'Failed to load training sessions';
        console.error(err);
        this.toastr.error('Error loading training sessions', 'Error');
        this.loading = false;
      }
    });
  }

  /**
   * Load sessions by province
   */
  loadByProvince(province: string): void {
    if (!province) {
      this.loadAllSessions();
      return;
    }

    this.loading = true;
    this.error = null;

    this.trainingService.getSessionsByProvince(province).subscribe({
      next: (data: TrainingSession[]) => {
        this.sessions = data;
        this.sessions.forEach(session => {
          session.statusText = this.trainingService.getStatusText(session.status);
        });
        this.applyFilters();
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = `Failed to load sessions for ${province}`;
        console.error(err);
        this.toastr.error('Error loading sessions', 'Error');
        this.loading = false;
      }
    });
  }

  /**
   * Apply filters to the data
   */
  applyFilters(): void {
    let filtered = this.sessions;

    if (this.filterStatus) {
      filtered = filtered.filter(s => s.status.toString() === this.filterStatus);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.trainingName.toLowerCase().includes(term) ||
        s.venue.toLowerCase().includes(term) ||
        s.trainer?.name?.toLowerCase().includes(term)
      );
    }

    this.displayedSessions = filtered;
  }

  /**
   * Edit session
   */
  editSession(session: TrainingSession): void {
    this.editingTrainingId = session.id || 0;
    this.showEditModal = true;
  }

  /**
   * Upload documents for session
   */
  uploadDocuments(session: TrainingSession): void {
    this.uploadingSessionId = session.id || 0;
    this.uploadingSessionName = session.trainingName;
    this.showUploadModal = true;
  }

  /**
   * Close edit modal
   */
  onEditModalClose(): void {
    this.showEditModal = false;
    this.editingTrainingId = 0;
  }

  /**
   * Close upload modal
   */
  onUploadModalClose(): void {
    this.showUploadModal = false;
    this.uploadingSessionId = 0;
    this.uploadingSessionName = '';
  }

  /**
   * Handle training session update
   */
  onTrainingUpdated(): void {
    this.showEditModal = false;
    this.editingTrainingId = 0;
    this.loadAllSessions();
    this.toastr.success('Training session updated successfully', 'Success');
  }

  /**
   * Handle document upload success
   */
  onUploadSuccess(): void {
    this.toastr.success('Document uploaded successfully', 'Success');
    // Don't reload sessions, just close modal
  }

  /**
   * Delete session
   */
  deleteSession(sessionId?: number): void {
    if (!sessionId) return;

    if (!confirm('Are you sure you want to delete this training session?')) {
      return;
    }

    const token = localStorage.getItem('authToken') || '';
    this.trainingService.deleteSession(sessionId, token).subscribe({
      next: () => {
        this.toastr.success('Training session deleted successfully', 'Success');
        this.loadAllSessions();
      },
      error: (err: unknown) => {
        this.error = 'Failed to delete training session';
        this.toastr.error('Error deleting session', 'Error');
        console.error(err);
      }
    });
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: number): string {
    switch (status) {
      case 1: return 'bg-primary';    // Scheduled
      case 2: return 'bg-accent';     // In Progress
      case 3: return 'bg-success';    // Completed
      case 4: return 'bg-warning';    // Cancelled
      default: return 'bg-primary';
    }
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'badge-primary';
      case 2: return 'badge-info';
      case 3: return 'badge-success';
      case 4: return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}
