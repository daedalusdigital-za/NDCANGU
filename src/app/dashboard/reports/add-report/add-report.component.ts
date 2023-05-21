import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    glucose: '',
    hbA1C: '',
    keyTone: '',
    totalColestorl: '',
    uricAcid: '',
    lactate: '',
    bloodPressue: '',
    recomendations: '',
    symptoms: '',
    remidies: '',
    gender: '',
    nextAppointmentDate: '',
    isMedicated: null,
    isDeleted: null,
    dateCreated: ''
  }


  // 'PatientId=11' \
  // -F 'Perscription=' \
  // -F 'Notes=' \
  // -F 'Remidies=' \
  // -F 'AtInstitution=' \
  // -F 'RecordedBy=9' \
  // -F 'Symptoms=' \
  // -F 'Recomendations=' \
  // -F 'Lactate=' \
  // -F 'IsMedicated=' \
  // -F 'Glucose=' \
  // -F 'KeyTone=' \
  // -F 'UricAcid=' \
  // -F 'Documents=' \
  // -F 'BloodPressue=' \
  // -F 'HBA1C=' \
  // -F 'NextAppointmentDate=' \
  // -F 'TotalColestorl='
  id: any;
  constructor(private route: ActivatedRoute, private baseService: BaseService, private globalService: GlobalService) { }

  ngOnInit(): void {

    this.id = this.route?.snapshot.paramMap.get('id');
    if (window.history.state?.data) {
      console.log(window.history.state.data);
      const patient: any = window.history.state.data;
      this.report.patientId = patient.id;
      // this.report.name = patient.name ? patient.name : '';
      // this.report.surname = patient.surname ? patient.surname : '';
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
      PatientId: this.report.patientId,
      Perscription: this.report.perscription,
      Notes: this.report.notes,
      Remidies: this.report.remidies,
      AtInstitution: this.report.atInstitution,
      RecordedBy: this.report.recordedBy,
      Symptoms: this.report.symptoms,
      Recomendations: this.report.recomendations,
      Lactate: this.report.lactate,
      // IsMedicated: this.report.isMedicated,
      Glucose: this.report.glucose,
      KeyTone: this.report.keyTone,
      UricAcid: this.report.uricAcid,
      Documents: this.report.documents,
      BloodPressue: this.report.bloodPressue,
      HBA1C: this.report. HBA1C,
      // NextAppointmentDate
      TotalColestorl: this.report.totalColestorl
      }
    this.baseService.basePost(`MedicalHistory/Add`, {
      "PatientId": "11",
        "Perscription": "",
        "Notes": "",
        "Remidies": "",
        "AtInstitution": "",
        "RecordedBy": "9",
        "Symptoms": "",
        "Recomendations": "",
        "Lactate": "",
        "IsMedicated": "",
        "Glucose": "",
        "KeyTone": "",
        "UricAcid": "",
        "Documents": "",
        "BloodPressue": "",
        "HBA1C": "",
        "NextAppointmentDate": "",
        "TotalColestorl": ""
    }).subscribe({
      next: (response: any) => {
        // this.report = response
      
      }
    })

  }

}
