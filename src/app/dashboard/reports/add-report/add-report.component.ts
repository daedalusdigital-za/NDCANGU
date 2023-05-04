import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {

  patient: any = {
    name: '',
    surname: '',
    gender: '',
    phoneNumber: '',
    age: null,
    lastAppointmentDate: null,
    nextAppointmentDate: null,
    notes: '',
    diagnosis: ''
  }
  constructor() { }

  ngOnInit(): void {
  }

}
