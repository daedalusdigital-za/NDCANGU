import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { GlobalService } from 'src/app/services/global/global.service';

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

  provinces: any;
  districts: any;
  constructor(private baseService: BaseService, private router: Router, 
    private _route: ActivatedRoute, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.id = this._route?.snapshot.paramMap.get('id');
    this.patient.province = this.globalService.selectedProvince;
    this.districts = this.globalService.selectedDistricts;
    if (this.id) {
      this.getPatientById()
    }
  }


  addEditPatient() {

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

  provinceChange(text: string){
    console.log(text);
    
    this.districts = this.globalService.getDistricts(text)
  }

  getAge(dateString?: any) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (today.getFullYear() < birthDate.getFullYear() && m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }


    this.patient.age = (age && age > 0) ? age : null;
    return age;
  }
}
