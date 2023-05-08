import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  topMenuSubject = new Subject<any>();
  selectedProvince: any;
  selectedDistricts: any;
  constructor( ) { }

  getLocalStorage(key: string){
    const localStorageVal = localStorage.getItem(key);
    if (localStorageVal !== null) {
      return JSON.parse(localStorageVal);
    } 
    return;
  }

  setLocalStorage(key: string, value: JSON){
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getDistricts(text: any) {
    if (text == 'Gauteng') {
     return ['Sedibeng', 'Ekurhuleni', 'City Of Johannesburg', 'City Of Tswane', 'West Rand']
    } else if (text == 'Limpopo') {
      return ['Capricorn', 'Mopani', 'Sekhukhune', 'Vhembe', 'Waterberge']
    } else if (text == 'North West') {
      return ['Bojanala Platinum', 'Dr kenneth kaunda', 'Dr Ruth Segomotsi Mompati', 'Ngaka Modlri Mclema']
    } else if (text == 'Eastern Cape') {
      return ['Alfred Nzo', 'Amathole', 'Buffalo', 'Chris Hani', 'Joe Gqabi', 'Nelson Mandela Bay Metropolitan']
    } else if (text == 'Western Cape') {
      return ['Cape Winelands', 'Central Karoo', 'City of CapeTown', 'Eden', 'Overberg', 'West Coast']
    } else if (text == 'KwaZulu-Natal') {
      return ['Amajuba', 'eThekwini', 'Harry Gwala', 'ilembe', 'King Cetshwayo', 'Ugu', 'uMgungundlovu', 'uMkhanyakude', 'uThukela', 'Zululand']
    } else if (text == 'Northern Cape') {
      return ['Fances Baard', 'John Taolo Gaetsewe', 'Namakwa', 'Pixley Ka Seme', 'ZF Mgcawa']
    } else if (text == 'Free State') {
      return ['Fezile Dabi', 'lejweeleputswa', 'Mangaung Thabo Mfoutsanyana', 'Xhaariep']
    } else {
      return ['EHLANZENI', 'GERT SIBANDE', 'NKANGALA']
    }
  }

  
}
