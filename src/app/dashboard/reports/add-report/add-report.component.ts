import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Component initialization logic
  }

  onSubmit() {
    // Report submission logic
    console.log('Report submitted');
  }

  onCancel() {
    // Cancel logic
    console.log('Report creation cancelled');
  }
}