import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseService } from 'src/app/services/base/base.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-modal-record-test',
  templateUrl: './modal-record-test.component.html',
  styleUrls: ['./modal-record-test.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalRecordTestComponent implements OnInit {
  testCateogry: any = [];
  medicalRecordCategories =   ["Glucose", "HBA1C","Key Tone", "Total Colestorl", "Uric Acid", "Lactate", "Blood Pressure"]

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
  constructor(private route: ActivatedRoute, private baseService: BaseService, private dialogConfig: DynamicDialogConfig,
    private globalService: GlobalService, private toastrService: ToastrService, private router: Router, private modalRef: DynamicDialogRef) { }


  ngOnInit(): void {
    console.log("~ this.dialogConfig.data:", this.dialogConfig.data)
    this.id = this.dialogConfig.data.id;
    if (this.dialogConfig.data) {
      console.log(this.dialogConfig.data);
      const patient: any = this.dialogConfig.data;
      this.report.patientId = patient.id;
      this.report.name = patient.name ? patient.name : '';
      this.report.surname = patient.surname ? patient.surname : '';
      this.report.gender = patient.gender ? patient.gender : '';
      this.report.province = patient.province ? patient.province : '';
      this.report.district = patient.district ? patient.district : '';
      this.report.recordedBy = (this.globalService.getLocalStorage('currentUser'))?.id
    }
  }

  addEditReport() {

    const payload: any = {
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
      hbA1C: this.report.HBA1C,
      totalColestorl: this.report.totalColestorl,
      nextAppointmentDate: this.report.nextAppointmentDate
    };

    this.baseService.basePost(`MedicalHistory/Add`, payload).subscribe({
      next: (response: any) => {
        this.toastrService.success("Success!, Medical history Added");
        this.router.navigateByUrl('/dashboard/patients');
        this.modalRef.close()
      }
    })

  }

}
