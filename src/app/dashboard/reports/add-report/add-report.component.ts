import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/services/base/base.service';
import { GlobalService } from 'src/app/services/global/global.service';

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
    recordedBy: '',
    patientId: '',
    phoneNumber: '',
    age: '',
    province: '',
    atInstitution: '',
    glucose: null,
    hbA1C: null,
    keyTone: null,
    totalColestorl: null,
    uricAcid: null,
    lactate: null,
    bloodPressue: null,
    recomendations: '',
    symptoms: '',
    remidies: null,
    gender: '',
    nextAppointmentDate: new Date().toISOString(),
    isMedicated: null,
    isDeleted: null,
  }

  id: any;
  constructor(private route: ActivatedRoute, private baseService: BaseService, 
              private globalService: GlobalService, private toastrService: ToastrService, private router: Router) { }
              

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
      this.report.recordedBy = (this.globalService.getLocalStorage('currentUser'))?.id
    }
    // if (this.id) {
    //   console.log(window.history.state, window.history.state?.data);

    //   // this.getReportById()
    // }

  }

  addEditReport() {

    const payload: any =  {
      patientId: this.report.patientId,     
      remidies: this.report.remidies,
      atInstitution: this.report.atInstitution,
      recordedBy: this.report.recordedBy,
      recomendations: this.report.recomendations,
      lactate: this.report.lactate,
      // IsMedicated: this.report.isMedicated,
      glucose: this.report.glucose,
      keyTone: this.report.keyTone,
      uricAcid: this.report.uricAcid,
      bloodPressue: this.report.bloodPressue,
      hbA1C: this.report. HBA1C,
      totalColestorl: this.report.totalColestorl,
      nextAppointmentDate: this.report.nextAppointmentDate
      };


      
    //   {
    //     "id": 0,
    // "recordedBy": 9,
    // "patientId": 11,
    // "atInstitution": "string",
    // "glucose": 0,
    // "hbA1C": 0,
    // "keyTone": 0,
    // "totalColestorl": 0,
    // "uricAcid": 0,
    // "lactate": 0,
    // "bloodPressue": 0,
    // "recomendations": "string",
    // "remidies": 0,
    // "nextAppointmentDate": "2023-06-07T16:25:44.628Z",
    // "isMedicated": true
    //   }
    this.baseService.basePost(`MedicalHistory/Add`, payload).subscribe({
      next: (response: any) => {
        // this.report = response
        this.toastrService.success("Success!, Medical history Added");
        this.router.navigateByUrl('/dashboard/reports');
      }
    })

  }

}
