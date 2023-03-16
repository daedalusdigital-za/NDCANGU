import { Component, OnInit } from '@angular/core';;
import { GuiColumn, GuiPaging, GuiPagingDisplay } from '@generic-ui/ngx-grid';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  columns: Array<GuiColumn> = [
    {
      header: 'Name',
      field: 'name'
    },
    {
      header: 'Job',
      field: 'job'
    },
    {
      header: 'Age',
      field: 'age'
    }];

  source: Array<any> = [
    {
      name: 'Brad',
      job: 'programmer',
      age: '40'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25'
    },
    {
      name: 'Brad',
      job: 'programmer',
      age: '40'
    },
    {
      name: 'John',
      job: 'athlete',
      age: '22'
    },
    {
      name: 'Eve',
      job: 'artist',
      age: '25'
    }];

    paging: GuiPaging = {
      enabled: true,
      page: 1,
      pageSize: 5,
      pageSizes: [5, 10, 25],
      pagerTop: false,
      pagerBottom: true,
      display: GuiPagingDisplay.ADVANCED
    };
  constructor() {}

  ngOnInit(): void {}

}
