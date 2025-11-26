import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../services/data/database.service';

@Component({
  selector: 'app-list-training',
  templateUrl: './list-training.component.html',
  styleUrls: ['./list-training.component.scss']
})
export class ListTrainingComponent implements OnInit {
  trainingSessions: any[] = [];
  isLoading = false;
  filteredSessions: any[] = [];
  searchTerm = '';
  filterStatus = '';
  filterProvince = '';

  // Status options based on numeric values
  statusOptions = [
    { value: 1, label: 'Planned', class: 'bg-secondary' },
    { value: 2, label: 'Scheduled', class: 'bg-primary' },
    { value: 3, label: 'In Progress', class: 'bg-warning' },
    { value: 4, label: 'Completed', class: 'bg-success' },
    { value: 5, label: 'Cancelled', class: 'bg-danger' }
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.isLoading = true;
    this.databaseService.getTrainingSessions().subscribe({
      next: (sessions) => {
        this.trainingSessions = sessions;
        this.filteredSessions = [...sessions];
        this.isLoading = false;
        console.log('Training sessions loaded:', sessions);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading training sessions:', error);
        this.toastr.error('Failed to load training sessions', 'Error');
      }
    });
  }

  applyFilters(): void {
    this.filteredSessions = this.trainingSessions.filter(session => {
      const matchesSearch = !this.searchTerm ||
        session.trainingName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (session.provinceName && session.provinceName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (session.venue && session.venue.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (session.trainer?.name && session.trainer.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesStatus = !this.filterStatus || session.status.toString() === this.filterStatus;
      const matchesProvince = !this.filterProvince || session.provinceName === this.filterProvince;

      return matchesSearch && matchesStatus && matchesProvince;
    });
  }

  getStatusBadge(status: number): any {
    const statusOption = this.statusOptions.find(opt => opt.value === status);
    return statusOption || { value: status, label: 'Unknown', class: 'bg-secondary' };
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getUniqueProvinces(): string[] {
    const provinces = this.trainingSessions.map(session => session.provinceName);
    return [...new Set(provinces)].filter(province => province && province.trim() !== '');
  }

  getCompletedSessionsCount(): number {
    return this.trainingSessions.filter(s => s.status === 4).length;
  }

  getInProgressSessionsCount(): number {
    return this.trainingSessions.filter(s => s.status === 3).length;
  }

  getScheduledSessionsCount(): number {
    return this.trainingSessions.filter(s => s.status === 2).length;
  }

  viewTrainingSession(session: any): void {
    // Navigate to training session details
    this.router.navigate(['/dashboard/training/view', session.id]);
  }

  openEditModal(session: any): void {
    this.router.navigate(['/dashboard/training/edit', session.id]);
  }

  addNewTraining(): void {
    this.router.navigate(['/dashboard/training/add']);
  }
}
