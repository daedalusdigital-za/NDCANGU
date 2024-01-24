import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BaseService } from 'src/app/services/base/base.service';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';
import { MedicalHistoryComponent } from '../medical-history/medical-history.component';
import { GlobalService } from 'src/app/services/global/global.service';
import { ModalRecordTestComponent } from './modal-record-test/modal-record-test.component';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss'], 
  providers: [ConfirmationService, DialogService],
})
export class ListPatientsComponent implements OnInit {

  ref: DynamicDialogRef;
  orgSource: Array<any> = [];
  source: Array<any> = [];
  formSearch: any = {
    name: '',
    surname: '',
    patientNumber: '',
  };
  cols: IColumns[] = [{
    header: 'Patient No',
    field: 'patientNumber',
    isAction: false,
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
    onClick: (item: any) => {
      console.log(item);
    }
  },
  {
    header: 'Name',
    field: 'name',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },

  {
    header: 'Surname',
    field: 'surname',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },

  {
    header: 'Gender',
    field: 'gender',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Contact No',
    field: 'phoneNumber',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Age',
    field: 'age',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Province',
    field: 'province',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'District',
    field: 'district',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Institution',
    field: 'institution',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Tests',
    field: 'Record Test',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      this.dialogService.open(ModalRecordTestComponent, {
        header: `${item?.name} ${item?.surname} Add Record`,
        width: '70%',
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        baseZIndex: 10000,
        data: item
    });
    },
    getValue: function () {
      return this.field
    },
  },
  {
    header: 'Medical History',
    field: 'View Medical History',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      // this.confirm(item.id);
      
      this.globalService.pid = item.id


      this.dialogService.open(MedicalHistoryComponent, {
        header: `${item?.name} ${item?.surname} History`,
        width: '70%',
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        baseZIndex: 10000,
        // data: item.id
    });
      // this.router.navigateByUrl('dashboard/reports');
    },
    getValue: function () {
      return this.field
    },
  },
  ];
  constructor(private baseService: BaseService, private confirmationService: ConfirmationService, 
    private toastrService: ToastrService, private router: Router, public dialogService: DialogService,
    private globalService: GlobalService) { }

  ngOnInit(): void {
    this.getPatients();
  }


  private getPatients() {
    this.baseService.baseGet('Patient/GetAll').subscribe({
      next: (response: any) => {
        this.source = response; 
        this.orgSource = response;
      }
    })
  }


  private confirm(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.baseService.baseDelete(`Patient/Delete?id=${id}`).subscribe({
          next: () => {
            this.toastrService.info('Record Deleted!');
            this.getPatients();
          }
        })
      }
    });
  }


  onSearch(){
    if(this.formSearch.name){
       this.source = this.source.filter((item: any) => item.name.toLowerCase().indexOf(this.formSearch.name) > -1);
    } else if(this.formSearch.surname){
      this.source = this.source.filter((item: any) => item.surname.toLowerCase().indexOf(this.formSearch.surname) > -1)
    } else if(this.formSearch.patientNumber){
       this.source =this.source.filter((item: any) => item.patientNumber.toLowerCase().indexOf(this.formSearch.patientNumber) > -1)      
    } else if(this.formSearch.name && this.formSearch.surname && this.formSearch.patientNumber){
      this.source = this.source.filter((item: any) => (item.name.toLowerCase().indexOf(this.formSearch.name) > -1) || item.surname.toLowerCase().indexOf(this.formSearch.surname) > -1 || item.patientNumber.toLowerCase().indexOf(this.formSearch.patientNumber) > -1) 
    } else {
        this.source = this.orgSource;
     }
     if(!this.source.length){
      this.toastrService.error('No record found!')
     }
  }
  
  onClear(){
    this.formSearch.name ='';
    this.formSearch.surname ='';
    this.formSearch.patientNumber ='';
    this.source = this.orgSource;
  }
}
