import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss'],
  providers: [DatePipe]
})
export class ListReportsComponent implements OnInit {
  cols: IColumns[] = [];

  source: Array<any> = [];

  constructor(private baseService: BaseService, private datePipe: DatePipe) { }

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
      header: 'Date Recorded',
      field: 'dateCreated',
      getValue: function(item: any) {
        const val: any = item[this.field] ? new Date(item[this.field]).toISOString().slice(0,10) : '';
        return val;
      },
    },
    {
      header: 'Last Updated',
      visible: false,
      field: 'dateCreated',
      getValue: function(item: any) {
        const val: any = item[this.field] ? new Date(item[this.field]).toISOString().slice(0,10) : '';
        return val;
      },
    },
  
    {
      header: 'Instituation',
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
      header: 'Treatment',
      field: 'isMedicated',
      getValue: function(item: any) {
        return item[this.field]
      },
    },
    {
      header: 'Ketone',
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
    this.baseService.baseGet('MedicalHistory/GetAll').subscribe({
      next:(response: any )=>{
        this.source = response;
      }
    })
  }

}
