import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {

  report: any = {
    name: '',
    surname: '',
    documents: '',
    notes: '',
    perscription: '',
    recordedBy: null,
    patientId: null,
    phoneNumber: '',
    age: null,
    province: '',
    atInstitution: '',
    glucose: null,
    hbA1C: '',
    keyTone: null,
    totalColestorl: null,
    uricAcid: null,
    lactate: null,
    bloodPressue: null,
    recomendations: '',
    symptoms: '',
    remidies: null,
    gender: '',
    nextAppointmentDate: '',
    // isMedicated: null,
    // isDeleted: null,
    // dateCreated: ''
  }

  id: any;
  constructor(private route: ActivatedRoute, private baseService: BaseService) { }

  ngOnInit(): void {

    this.id = this.route?.snapshot.paramMap.get('id');
    if (window.history.state?.data) {
      console.log(window.history.state.data);
      const patient: any = window.history.state.data;
      this.report.patientId = patient.id;
      this.report.name = patient.name ? patient.name : '';
      this.report.surname = patient.surname ? patient.surname : '';
      this.report.gender = patient.gender ? patient.gender : '';
      this.report.province = patient.province ? patient.province : '';
      this.report.district = patient.district ? patient.district : '';
    }
    // if (this.id) {
    //   console.log(window.history.state, window.history.state?.data);

    //   // this.getReportById()
    // }

  }

  addEditReport() {
    this.baseService.basePost(`MedicalHistory/Add`, this.report).subscribe({
      next: (response: any) => {
        // this.report = response
      
      }
    })

  }

}
