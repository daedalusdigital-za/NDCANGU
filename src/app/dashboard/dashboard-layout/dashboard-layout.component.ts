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
  isMenuShown: boolean = false;
  isNurseUser: boolean = false;
  districts: Array<string> = ['EHLANZENI', 'GERT SIBANDE', 'NKANGALA'];
  constructor(private globalService: GlobalService) {
    this.user = this.globalService.getLocalStorage('currentUser');
    if (this.user) {
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      if (this.user.role[0] == 'Admin') {
        this.isMenuShown = true;
      } else if (this.user.role[0] == 'Nurse') {
        this.isNurseUser = true;
      }

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
    if (text == 'Gauteng') {
      this.districts = ['Sedibeng', 'Ekurhuleni', 'City Of Johannesburg', 'City Of Tswane', 'West Rand']
    } else if (text == 'Limpopo') {
      this.districts = ['Capricorn', 'Mopani', 'Sekhukhune', 'Vhembe', 'Waterberge']
    } else if (text == 'North West') {
      this.districts = ['Bojanala Platinum', 'Dr kenneth kaunda', 'Dr Ruth Segomotsi Mompati', 'Ngaka Modlri Mclema']
    } else if (text == 'Estern Cape') {
      this.districts = ['Alfred Nzo', 'Amathole', 'Buffalo', 'Chris Hani', 'Joe Gqabi', 'Nelson Mandela Bay Metropolitan']
    } else if (text == 'Western Cape') {
      this.districts = ['Cape Winelands', 'Central Karoo', 'City of CapeTown', 'Eden', 'Overberg', 'West Coast']
    } else if (text == 'Kwazulu Natal') {
      this.districts = ['Amajuba', 'eThekwini', 'Harry Gwala', 'ilembe', 'King Cetshwayo', 'Ugu', 'uMgungundlovu', 'uMkhanyakude', 'uThukela', 'Zululand']
    } else if (text == 'Northen Cape') {
      this.districts = ['Fances Baard', 'John Taolo Gaetsewe', 'Namakwa', 'Pixley Ka Seme', 'ZF Mgcawa']
    } else if (text == 'Freestate') {
      this.districts = ['Fezile Dabi', 'lejweeleputswa', 'Mangaung Thabo Mfoutsanyana', 'Xhaariep']
    } else {
      this.districts = ['EHLANZENI', 'GERT SIBANDE', 'NKANGALA']
    }
  }

  Logout() {
    localStorage.clear()
  }

}
