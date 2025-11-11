import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-reports',
  templateUrl: './custom-reports.component.html',
  styleUrls: ['./custom-reports.component.scss']
})
export class CustomReportsComponent implements OnInit {

  reports: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    // Load custom reports logic
    this.reports = [
      { id: 1, title: 'Monthly Medical Report', type: 'medical', date: '2025-11-01' },
      { id: 2, title: 'Training Summary', type: 'training', date: '2025-11-05' },
      { id: 3, title: 'Inventory Status', type: 'inventory', date: '2025-11-10' }
    ];
  }

  viewReport(reportId: number) {
    console.log('Viewing report:', reportId);
  }

  editReport(reportId: number) {
    console.log('Editing report:', reportId);
  }

  deleteReport(reportId: number) {
    console.log('Deleting report:', reportId);
    this.reports = this.reports.filter(r => r.id !== reportId);
  }
}