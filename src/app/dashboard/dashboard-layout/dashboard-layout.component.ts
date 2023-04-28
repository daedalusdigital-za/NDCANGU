import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  user: any;
  flagText: string = 'Mpumalanga';
  flagImg: string = 'assets/images/flags/Mpumalanga.jpg';
  isRoleAdmin: boolean = false;
  constructor(private globalService: GlobalService) {
    this.user = this.globalService.getLocalStorage('currentUser');
    if(this.user){
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      if(this.user.role[0] =='Admin'){
        this.isRoleAdmin = true;
      }
      // this.userRole = this.user.role && this.user.role[0] ? this.user.role[0] : ''
    }
   }

  ngOnInit(): void {
  }

  menuChanges(item: any){
    this.globalService.topMenuSubject.next(item);
  }

  changeFlagItem(img: string, text: string){
    this.flagImg = img;
    this.flagText = text;
  }

  Logout(){
    localStorage.clear()
  }

}
