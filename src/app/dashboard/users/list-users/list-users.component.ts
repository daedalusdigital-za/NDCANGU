import { Component, OnInit } from '@angular/core';;
import { GuiColumn, GuiPaging, GuiPagingDisplay, GuiSearching } from '@generic-ui/ngx-grid';
import { BaseService } from 'src/app/services/base/base.service';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

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

    searching: GuiSearching = {
      enabled: true,
      placeholder: 'Search Users',
      phrase: '',
      highlighting: true
    };
  constructor(private baseService: BaseService) {}

  ngOnInit(): void {
   this.getUsers()
  }

  private getUsers(){
    this.baseService.baseGet('User/GetUsers').subscribe({
      next: (response: any)=>{
        this.source = response; 
      }
    })
  }

  edit(item: any){
    console.log(item);
    
  }

}
