import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit {
  cols: IColumns[];
  source: any = [];
  isShown: boolean = false;
  constructor(private baseService: BaseService, private globalService: GlobalService) {
    
   }

  ngOnInit(): void {
    

    this.getCols();
  }


  private getCols(){
    this.cols = [
      {
        header: 'Name',
        field: 'name',
        getValue: function(item: any) {
          return item[this.field] 
        },
      },
      {
        header: 'Surname',
        field: 'surname',
        getValue: function(item: any) {
          return item[this.field] 
        },
      },
      {
      header: 'Date created',
      field: 'dateCreated',
      getValue: function(item: any) {
        const val: any = item[this.field] ? new Date(item[this.field]).toISOString().slice(0,10) : '';
        return val;
      },
    },
    {
      header: 'Last Updated',
      field: 'dateCreated',
      getValue: function(item: any) {
        const val: any = item[this.field] ? new Date(item[this.field]).toISOString().slice(0,10) : '';
        return val;
      },
    },
  
    {
      header: 'Atinstituation',
      field: 'atInstitution',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Bloodpressue',
      field: 'bloodPressue',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Glucose',
      field: 'glucose',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'HBA1C',
      field: 'hbA1C',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'IsMedicated',
      field: 'isMedicated',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Keytone',
      field: 'keyTone',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Lactate',
      field: 'lactate',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    
    {
      header: 'Next Appointment',
      field: 'nextAppointmentDate',
      visible: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Recomendations',
      field: 'recomendations',
      visible: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
  ];

  this.getHistorty();
   }

  private getHistorty(){
    this.baseService.baseGet(`MedicalHistory/GetByPatientId?id=${this.globalService.pid}`).subscribe({
      next:(response: any )=>{
        this.source = response;
        this.isShown = true;
      }
    })
  }
}
