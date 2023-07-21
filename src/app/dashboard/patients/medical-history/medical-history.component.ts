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
        isFilter: false,
        getValue: function(item: any) {
          return item[this.field] 
        },
      },
      {
        header: 'Surname',
        field: 'surname',
        isFilter: false,
        getValue: function(item: any) {
          return item[this.field] 
        },
      },
      {
      header: 'Date created',
      field: 'dateCreated',
      isFilter: false,
      getValue: function(item: any) {
        const val: any = item[this.field] ? new Date(item[this.field]).toISOString().slice(0,10) : '';
        return val;
      },
    },
    {
      header: 'Last Updated',
      visible: false,
      field: 'dateCreated',
      isFilter: false,
      getValue: function(item: any) {
        const val: any = item[this.field] ? new Date(item[this.field]).toISOString().slice(0,10) : '';
        return val;
      },
    },
  
    {
      header: 'instituation',
      field: 'Institution',
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Bloodpressue',
      field: 'bloodPressue',
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Glucose',
      field: 'glucose',
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'HBA1C',
      field: 'hbA1C',
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'IsMedicated',
      field: 'isMedicated',
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Keytone',
      field: 'keyTone',
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Lactate',
      field: 'lactate',
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    
    {
      header: 'Next Appointment',
      field: 'nextAppointmentDate',
      visible: false,
      isFilter: false,
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Recomendations',
      field: 'recomendations',
      visible: false,
      isFilter: false,
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
