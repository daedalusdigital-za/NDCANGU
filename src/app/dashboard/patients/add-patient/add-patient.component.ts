import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';

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
  constructor(private baseService: BaseService, private router: Router) { }

  ngOnInit(): void {
  }


  createPatient(){
    this.baseService.basePost('Patient/Add', {
      name: this.patient.name,
      surname: this.patient.surname,
      age: this.patient.age,
      phoneNumber: this.patient.phoneNumber
    }).subscribe({
      next: (response)=>{
        this.router.navigateByUrl('/dashboard/patients')
      }
    })

  }
}
