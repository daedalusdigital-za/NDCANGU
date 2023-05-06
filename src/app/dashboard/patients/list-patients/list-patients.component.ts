import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

import { BaseService } from 'src/app/services/base/base.service';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss'], 
  providers: [ConfirmationService]
})
export class ListPatientsComponent implements OnInit {

  source: Array<any> = [];
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
    header: 'Type',
    field: 'gesttational',
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
    header: 'View/Edit',
    field: 'View/Edit',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      this.router.navigateByUrl('dashboard/patients/edit/' + item.id);
    },
    getValue: function () {
      return this.field
    },
  },
  {
    header: 'Delete',
    field: 'Delete',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      this.confirm(item.id);
    },
    getValue: function () {
      return this.field
    },
  },
  ];
  constructor(private baseService: BaseService, private confirmationService: ConfirmationService, 
    private toastrService: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.getPatients();
  }


  private getPatients() {
    this.baseService.baseGet('Patient/GetAll').subscribe({
      next: (response: any) => {
        this.source = response;
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
}
