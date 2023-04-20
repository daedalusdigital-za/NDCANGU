import { Component, OnInit } from '@angular/core';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss']
})
export class ListReportsComponent implements OnInit {
  isloaded: boolean = false;
// Surname , FirstName , Gender, Age , DateOfTesting , BloodPressure , Random HGT , HBA1c Reading , Province ,District
  cols: IColumns[] = [{
    header: 'Surname',
    field: 'name',
    isAction: false,
    getValue: function(item: any) {
      return item[this.field]
    },
    onClick: (item: any) => {
      console.log(item);
    }
  },
  {
    header: 'FirstName',
    field: 'job',
    getValue: function(item: any) {
      return item[this.field]
    },
  },

  {
    header: 'Gender',
    field: 'height',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Age',
    field: 'age',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'DateOfTesting',
    field: 'age',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'BloodPressure',
    field: 'age',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Random HGT',
    field: 'age',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'HBA1c Reading',
    field: 'age',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Province',
    field: 'age',
    visible: false,
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'District',
    field: 'name',
    visible: false,
    getValue: function(item: any) {
      return item[this.field]
    },
  },
];

  source: Array<any> = [
    {
      name: 'Brad',
      job: 'programmer',
      age: '40',
      height: '14',
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22',
      height: '25'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25',
      height: '20'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40',
      height: '10'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22',
      height: '15'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25',
      height: '6'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40',
      height: '9'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22',
      height: '0.5'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25',
      height: '0.6'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40',
      height: '5.2'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22',
      height: '5.2'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25',
      height: '4.2'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40',
      height: '0.2'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22',
      height: '1.0'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25',
      height: '2.2'
    }];

  
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isloaded = true
    }, 100);
  }

}
