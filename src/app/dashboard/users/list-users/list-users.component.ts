import { Component, OnInit } from '@angular/core'; import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
  providers: [ConfirmationService]
})
export class ListUsersComponent implements OnInit {

  source: Array<any> = [];
  cols: IColumns[] = [{
    header: 'Name',
    field: 'firstName',
    isAction: false,
    getValue: function (item: any) {
      return item[this.field]
    },
    onClick: (item: any) => {
      console.log(item);
    }
  },
  {
    header: 'Surname',
    field: 'lastName',
    getValue: function (item: any) {
      return item[this.field]
    },
  },

  {
    header: 'Email',
    field: 'email',
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Contact No',
    field: 'phoneNumber',
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Job',
    field: 'positionName',
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Type',
    field: 'positionDesc',
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Province',
    field: 'contactName',
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'View/Edit',
    field: 'View/Edit',
    isAction: true,
    onClick: (item: any) => {
      this.router.navigateByUrl('dashboard/users/edit/' + item.id);
    },
    getValue: function () {
      return this.field
    },
  },
  {
    header: 'Delete',
    field: 'Delete',
    isAction: true,
    onClick: (item: any) => {
      this.confirm(item.id);
    },
    getValue: function () {
      return this.field
    },
  },
  ];


  constructor(
    private baseService: BaseService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  private getUsers() {
    this.baseService.baseGet('User/GetUsers').subscribe({
      next: (response: any) => {
        this.source = response;
      }
    })
  }

  edit(item: any) {
    console.log(item);

  }

  private confirm(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.baseService.baseDelete(`User/Delete?id=${id}`).subscribe({
          next: () => {
            this.toastrService.info('Record Deleted!');
            this.getUsers();
          }
        })
      }
    });
  }

}
