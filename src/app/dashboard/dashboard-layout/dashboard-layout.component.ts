import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  user: any;
  flagText: string = 'KwaZulu-Natal';
  flagImg: string = 'assets/images/flags/italy.png';
  isMenuShown: boolean = false;
  isNurseUser: boolean = false;
  districts: Array<string> = ['EHLANZENI', 'GERT SIBANDE', 'NKANGALA'];
  pdflink: string = 'assets/pdfs/Mpumalanga.pdf';
  constructor(private globalService: GlobalService) {
    this.user = this.globalService.getLocalStorage('currentUser');
    this.globalService.selectedProvince = this.flagText;
    this.globalService.selectedDistricts = this.districts;
    if (this.user) {
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      if (this.user.role[0] == 'Admin') {
        this.isMenuShown = true;
      } else if (this.user.role[0] == 'Nurse') {
        this.isNurseUser = true;
      }

      this.districts = this.globalService.getDistricts(this.flagText)
      this.pdflink = `assets/pdfs/${this.flagText}.pdf`;
      // this.userRole = this.user.role && this.user.role[0] ? this.user.role[0] : ''
    }
  }

  ngOnInit(): void {
  }

  menuChanges(item: any) {
    this.globalService.topMenuSubject.next(item);
  }

  changeFlagItem(img: string, text: string) {
    this.flagImg = img;
    this.flagText = text;

    this.pdflink = `assets/pdfs/${text}.pdf`;
    this.districts = this.globalService.getDistricts(text)
   
    this.globalService.selectedProvince = this.flagText;
    this.globalService.selectedDistricts = this.districts;
  }

  Logout() {
    localStorage.clear()
  }

}
