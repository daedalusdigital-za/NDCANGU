import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent implements OnInit {
  id: any;
  patient: any = {
    name: '',
    surname: '',
    patientNumber: '',
    gender: '',
    phoneNumber: '',
    age: null,
    gesttational: true,
    dateOfBirth: '',
    province: '',
    district: '',
    institution: ''
  }
  constructor(private baseService: BaseService, private router: Router, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this._route?.snapshot.paramMap.get('id');
    if (this.id) {
      this.getPatientById()
    }
  }


  createPatient() {

    if (this.id) {
      this.baseService.basePatch('Patient/Update', this.patient).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/dashboard/patients')
        }
      })
    } else {
      this.baseService.basePost('Patient/Add', this.patient).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/dashboard/patients')
        }
      })
    }
  }

  private getPatientById() {
    this.baseService.baseGet(`Patient/GetById?id=${this.id}`).subscribe({
      next: (response: any) => {
        this.patient = response
      }
    })
  }
}
