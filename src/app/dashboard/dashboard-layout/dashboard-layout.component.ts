import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  user: any;
  constructor(private globalService: GlobalService) {
    this.user = this.globalService.getLocalStorage('currentUser');
    if(this.user){
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
    }
   }

  ngOnInit(): void {
  }

  menuChanges(item: any){
    this.globalService.topMenuSubject.next(item);
  }

}
