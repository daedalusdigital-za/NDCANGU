import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent implements OnInit {

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
