import { Component, OnInit } from '@angular/core';;
import { GuiColumn, GuiPaging, GuiPagingDisplay } from '@generic-ui/ngx-grid';
import { UserService } from 'src/app/services/users/user.service';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  columns: Array<GuiColumn> = [
    {
      header: 'Name',
      field: 'firstName'
    },
    {
      header: 'Surname',
      field: 'lastName'
    },
    {
      header: 'Email',
      field: 'email'
    },
    {
      header: 'Contact No',
      field: 'phoneNumber'
    },
    {
      header: 'Job',
      field: 'positionName'
    },
    {
      header: 'Type',
      field: 'positionDesc'
    },
    {
      header: 'Province',
      field: 'contactName'
    }
  ];

  source: Array<any> = [];

    paging: GuiPaging = {
      enabled: true,
      page: 1,
      pageSize: 10,
      pageSizes: [5, 10, 25],
      pagerTop: false,
      pagerBottom: true,
      display: GuiPagingDisplay.ADVANCED
    };
  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
   this.getUsers()
  }

  private getUsers(){
    this.userService.getUsers().subscribe({
      next:(response: any)=> {
        this.source = response;        
      },
    })
  }

}
