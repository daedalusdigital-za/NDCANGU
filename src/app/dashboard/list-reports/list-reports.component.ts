import { Component, OnInit } from '@angular/core';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss']
})
export class ListReportsComponent implements OnInit {
  cols: IColumns[] = [{
    header: 'FirstName',
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
    header: 'Surname',
    field: 'surname',
    getValue: function(item: any) {
      return item[this.field]
    },
  },

  {
    header: 'Gender',
    field: 'Gender',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Gestational',
    field: 'gestational',
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
    header: 'Uric Acid',
    field: 'UricAcid',
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
    header: 'BloodPressure',
    field: 'bp',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'HBA1c',
    field: 'HBA1c',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Ketone',
    field: 'ketone',
    getValue: function(item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Province',
    field: 'Province',
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
      surname: 'Duma',
      Gender: 'male',
      gestational:'no',
      bp:'110/80',
      age: '40',
      height: '14',
      HBA1c:'7.4',
      ketone:'0.5',
      lactate:'2.2',
      UricAcid:'3.4',
      Province:'Mpumalanga'
    },
    {
      name: 'Thandiswa',
      surname: 'Myeni',
      Gender: 'female',
      gestational:'no',
      bp:'96/70',
      age: '22',
      height: '25',
      HBA1c:'6.0',
      ketone:'0.8',
      lactate:'3.2',
      UricAcid:'2.2',
      Province:'Mpumalanga'
    },
    {
      name: 'Sanah',
      surname: 'Mahlaba',
      Gender: 'female',
      gestational:'yes',
      bp:'130/90',
      age: '25',
      height: '20',
      HBA1c:'6.5',
      ketone:'0.4',
      lactate:'2.1',
      UricAcid:'2.4',
      Province:'Mpumalanga'
    },
    {
      name: 'Gabisile',
      surname: 'Khoza',
      Gender: 'female',
      gestational:'no',
      bp:'91/62',
      age: '40',
      height: '10',
      HBA1c:'11.5',
      ketone:'0.5',
      lactate:'2.7',
      UricAcid:'1.6',
      Province:'Mpumalanga'
    },
    {
      name: 'Lawrence',
      surname: 'Booysen',
      Gender: 'male',
      gestational:'no',
      bp:'81/65',
      age: '22',
      height: '15',
      HBA1c:'10.2',
      ketone:'2.1',
      lactate:'3.2',
      UricAcid:'5.4',
      Province:'Mpumalanga'
    },
    {
      name: 'Thandeka',
      surname: 'Kunene',
      Gender: 'female',
      gestational:'yes',
      bp:'97/70',
      age: '25',
      height: '6',
      HBA1c:'6.0',
      ketone:'0.1',
      lactate:'1.2',
      UricAcid:'1.6',
      Province:'Mpumalanga'
    },
    {
      name: 'Musa',
      surname: 'Bucibo',
      Gender: 'male',
      gestational:'no',
      bp:'101/92',
      age: '40',
      height: '9',
      HBA1c:'6.0',
      ketone:'0.1',
      lactate:'4.8',
      UricAcid:'3.3',
      Province:'Mpumalanga'
    },
    {
      name: 'Zethu',
      surname: 'Ndlamlenza',
      Gender: 'female',
      gestational:'no',
      bp:'137/98',
      age: '22',
      height: '0.5',
      HBA1c:'5.5',
      ketone:'0.1',
      lactate:'2.1',
      UricAcid:'1.7',
      Province:'Mpumalanga'
    },
    {
      name: 'Jabulile',
      surname: 'Sibiya',
      Gender: 'female',
      gestational:'no',
      bp:'156/106',
      age: '25',
      height: '0.6',
      HBA1c:'5.9',
      ketone:'0.1',
      lactate:'4.7',
      UricAcid:'2.1',
      Province:'Mpumalanga'
    },
    {
      name: 'Celani',
      surname: 'Zondo',
      Gender: 'female',
      gestational:'no',
      bp:'98/69',
      age: '40',
      height: '5.2',
      HBA1c:'6.8',
      ketone:'0.1',
      lactate:'4.2',
      UricAcid:'1.4',
      Province:'Mpumalanga'
    },
    {
      name: 'John',
      surname: 'Khubheka',
      Gender: 'male',
      gestational:'no',
      bp:'113/90',
      age: '22',
      height: '5.2',
      HBA1c:'6.2',
      ketone:'0.1',
      lactate:'1.8',
      UricAcid:'2.1',
      Province:'Mpumalanga'
    },
    {
      name: 'Zodwa',
      surname: 'Fihla',
      Gender: 'female',
      gestational:'yes',
      bp:'156/102',
      age: '25',
      height: '4.2',
      HBA1c:'7.5',
      ketone:'0.1',
      lactate:'3.1',
      UricAcid:'7.9',
      Province:'Mpumalanga'
    },
    {
      name: 'Zandile',
      surname: 'Nyide',
      Gender: 'female',
      gestational:'no',
      bp:'120/90',
      age: '40',
      height: '0.2',
      HBA1c:'6.3',
      ketone:'0.1',
      lactate:'1.9',
      UricAcid:'8.6',
      Province:'Mpumalanga'
    },
    {
      name: 'Ndumiso',
      surname: 'Shabalala',
      Gender: 'male',
      gestational:'no',
      bp:'161/110',
      age: '22',
      height: '1.0',
      HBA1c:'11.5',
      ketone:'0.1',
      lactate:'2.0',
      UricAcid:'8.7',
      Province:'Mpumalanga'
    },
    {
      name: 'Eve',
      surname: 'Maduna',
      Gender: 'male',
      gestational:'no',
      bp:'159/105',
      age: '25',
      height: '2.2',
      HBA1c:'5.3',
      ketone:'0.1',
      lactate:'3.2',
      UricAcid:'6.5',
      Province:'Mpumalanga'
    },
    {
      name: 'Xolani',
      surname: 'zungu',
      Gender: 'male',
      gestational:'no',
      bp:'120/76',
      age: '25',
      height: '2.2',
      HBA1c:'6.0',
      ketone:'0.1',
      lactate:'2.6',
      UricAcid:'3.6',
      Province:'Mpumalanga'
    },
    {
      name: 'Mbali',
      surname: 'Sikhakhane',
      Gender: 'female',
      gestational:'yes',
      bp:'117/56',
      age: '25',
      height: '2.2',
      HBA1c:'5.5',
      ketone:'0.1',
      lactate:'1.8',
      UricAcid:'2.5',
      Province:'Mpumalanga'
    },
    {
      name: 'Mduduzi',
      surname: 'kunene',
      Gender: 'male',
      gestational:'no',
      bp:'98/62',
      age: '25',
      height: '2.2',
      HBA1c:'6.8',
      ketone:'0.1',
      lactate:'1.2',
      UricAcid:'4.3',
      Province:'Mpumalanga'
    }];

  
  constructor() { }

  ngOnInit(): void {  }

}
