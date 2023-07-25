import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  topMenuSubject = new Subject<any>();
  selectedProvince: any;
  selectedDistricts: any;
  selectedInstitution: any;
  pid: any;
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
 
  getInstitution(text: any) {
    if (text == 'Gauteng') {
     return ['​Roodepoort West Princess Clinic', 'Lenmed Clinic', '​Randburg Clinic', 'Zandspruit Clinic', 'West Rand', 'Siphumlile', 'Albertina Sisulu Clinic', 'Usizolwethu Clinic', 'Heidelberg Clinic', 'Rensburg Clinic', 'Mpumelelo Clinic', 'Boitumelo Clinic', 'Khutsong East Clinic', 'Greenspark Clinic', 'Randgate Clinic', 'Ya Rona Clinic', 'Thusanang Clinic', 'Venterspos Clinic', 'Ubuntu Clinic', 'Doornpoort Satellite Clinic', 'Phahameng Clinic', 'Dilopye Clinic', 'Soshanguve Block Tt Clinic', 'Skinner Street Clinic','Tsakane Clinic','Sead Clinic','Motsamai Clinic','Erin Clinic','Dukathole Clinic',' Boksburg North Clinic']
    } else if (text == 'Limpopo') {
      return ['Capricorn', 'Mopani', 'Sekhukhune', 'Vhembe', 'Waterberge']
    } else if (text == 'North West') {
      return ['Bojanala Platinum', 'Dr kenneth kaunda', 'Dr Ruth Segomotsi Mompati', 'Ngaka Modlri Mclema']
    } else if (text == 'Eastern Cape') {
      return ['Alfred Nzo', 'Amathole', 'Buffalo', 'Chris Hani', 'Joe Gqabi', 'Nelson Mandela Bay Metropolitan']
    } else if (text == 'Western Cape') {
      return ['Cape Winelands', 'Central Karoo', 'City of CapeTown', 'Eden', 'Overberg', 'West Coast']
    } else if (text == 'KwaZulu-Natal') {
      return ['HAILEY STOT CLINIC', 'KWANGCOLOSI CLINIC ', 'KWANDENGEZI CLINIC ', 'ZWELIBONVU CLINIC', 'CLEMONT CLINIC', 'DANGANYA CLINIC', 'EZIMWINI CLINIC', 'KWAMAKHUTHA CLINIC', 'KWANDENGEZI CLINIC', 'ZWELIBONVU CLINIC', 'CLEMONT CLINIC ', 'HAILEY STOT CLINIC', 'CLEMONT CLINIC', 'EZIMWINI CLINIC', 'ZWELIBONVU CLINIC']
    } else if (text == 'Northern Cape') {
      return ['Fances Baard', 'John Taolo Gaetsewe', 'Namakwa', 'Pixley Ka Seme', 'ZF Mgcawa']
    } else if (text == 'Free State') {
      return ['Fezile Dabi', 'lejweeleputswa', 'Mangaung Thabo Mfoutsanyana', 'Xhaariep']
    } else {
      return ['Sihlangu Clinic', 'Zoeknog Clinic', 'Belfast Clinic', 'Hluvukani CHC', 'Edinburg Clinic', 'Sabie Clinic', 'MAfrica CHC', 'Luphisi Clinic', 'Nkwalini Clinic', 'Msogwaba Clinic', 'Vlakplass Clinic', 'Bettysgoet Clinic', 'Fernie Clinic 1', 'Morgenzon Clinic', 'Warbuton Clinic', 'Driefontein CHC', 'Stanwest Clinic', 'KwaNgema CHC', 'Perdekop CHC', 'Wakkerstrom Clinic', 'Hlalanikahle Clinic', 'Poly Clinic', 'Klarinet CHC', 'Rietspruit Clinic', 'Kriel Clinic', 'Botleng Clinic', 'Delmas Clinic', 'Thubelihle CHC', 'Lynville Clinic', 'Beatty Clinic']
    }
  }

  // Convert JSON to Excel and download the file
  exportToExcel(jsonData: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  // Save the Excel file
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName + '.xlsx';
    link.click();
  }
  
}
