import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { DatabaseService } from '../../../services/data/database.service';

interface LocationData {
  provinces: string[];
  districts: { [key: string]: string[] };
  institutions: { [key: string]: string[] };
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  topMenuSubject = new Subject<any>();
  selectedProvince: string | null = null;
  selectedDistricts: string[] | null = null;
  selectedInstitution: string | null = null;
  pid: string | null = null;

  private readonly locationData: LocationData = {
    provinces: [
      'Gauteng', 'Limpopo', 'North West', 'Eastern Cape',
      'Western Cape', 'KwaZulu-Natal', 'Northern Cape',
      'Free State', 'Mpumalanga'
    ],
    districts: {
      'Gauteng': ['Sedibeng', 'Ekurhuleni', 'City Of Johannesburg', 'City Of Tswane', 'West Rand'],
      'Limpopo': ['Capricorn', 'Mopani', 'Sekhukhune', 'Vhembe', 'Waterberge'],
      'North West': ['Bojanala Platinum', 'Dr kenneth kaunda', 'Dr Ruth Segomotsi Mompati', 'Ngaka Modlri Mclema'],
      'Eastern Cape': ['Alfred Nzo', 'Amathole', 'Buffalo', 'Chris Hani', 'Joe Gqabi', 'Nelson Mandela Bay Metropolitan'],
      'Western Cape': ['Cape Winelands', 'Central Karoo', 'City of CapeTown', 'Eden', 'Overberg', 'West Coast'],
      'KwaZulu-Natal': ['Amajuba', 'eThekwini', 'Harry Gwala', 'ilembe', 'King Cetshwayo', 'Ugu', 'uMgungundlovu', 'uMkhanyakude', 'uThukela', 'Zululand'],
      'Northern Cape': ['Fances Baard', 'John Taolo Gaetsewe', 'Namakwa', 'Pixley Ka Seme', 'ZF Mgcawa'],
      'Free State': ['Fezile Dabi', 'lejweeleputswa', 'Mangaung Thabo Mfoutsanyana', 'Xhaariep'],
      'Mpumalanga': ['EHLANZENI', 'GERT SIBANDE', 'NKANGALA']
    },
    institutions: {
      'Gauteng': [
        'Roodepoort West Princess Clinic', 'Lenmed Clinic', 'Randburg Clinic', 'Zandspruit Clinic',
        'West Rand', 'Siphumlile', 'Albertina Sisulu Clinic', 'Usizolwethu Clinic', 'Heidelberg Clinic',
        'Rensburg Clinic', 'Mpumelelo Clinic', 'Boitumelo Clinic', 'Khutsong East Clinic', 'Greenspark Clinic',
        'Randgate Clinic', 'Ya Rona Clinic', 'Thusanang Clinic', 'Venterspos Clinic', 'Ubuntu Clinic',
        'Doornpoort Satellite Clinic', 'Phahameng Clinic', 'Dilopye Clinic', 'Soshanguve Block Tt Clinic',
        'Skinner Street Clinic', 'Tsakane Clinic', 'Sead Clinic', 'Motsamai Clinic', 'Erin Clinic',
        'Dukathole Clinic', 'Boksburg North Clinic'
      ],
      'KwaZulu-Natal': [
        'HAILEY STOT CLINIC', 'KWANGCOLOSI CLINIC', 'KWANDENGEZI CLINIC', 'ZWELIBONVU CLINIC',
        'CLEMONT CLINIC', 'DANGANYA CLINIC', 'EZIMWINI CLINIC', 'KWAMAKHUTHA CLINIC'
      ],
      'Mpumalanga': [
        'Sihlangu Clinic', 'Zoeknog Clinic', 'Belfast Clinic', 'Hluvukani CHC', 'Edinburg Clinic',
        'Sabie Clinic', 'MAfrica CHC', 'Luphisi Clinic', 'Nkwalini Clinic', 'Msogwaba Clinic',
        'Vlakplass Clinic', 'Bettysgoet Clinic', 'Fernie Clinic 1', 'Morgenzon Clinic', 'Warbuton Clinic',
        'Driefontein CHC', 'Stanwest Clinic', 'KwaNgema CHC', 'Perdekop CHC', 'Wakkerstrom Clinic',
        'Hlalanikahle Clinic', 'Poly Clinic', 'Klarinet CHC', 'Rietspruit Clinic', 'Kriel Clinic',
        'Botleng Clinic', 'Delmas Clinic', 'Thubelihle CHC', 'Lynville Clinic', 'Beatty Clinic'
      ]
    }
  };

  constructor(private databaseService: DatabaseService) { }

  /**
   * Get item from localStorage with type safety
   */
  getLocalStorage<T>(key: string): T | null {
    try {
      const localStorageVal = localStorage.getItem(key);
      if (localStorageVal !== null) {
        return JSON.parse(localStorageVal) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error parsing localStorage item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage with error handling
   */
  setLocalStorage<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
    }
  }

  /**
   * Clear all localStorage items
   */
  clearLocalStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Location functions removed - no longer needed
   */

  /**
   * Export JSON data to Excel file with improved error handling
   */
  exportToExcel(jsonData: any[], fileName: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
          console.warn('No data provided for Excel export');
          resolve(false);
          return;
        }

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'data': worksheet },
          SheetNames: ['data']
        };

        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const success = this.saveAsExcelFile(excelBuffer, fileName);
        resolve(success);
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        resolve(false);
      }
    });
  }

  /**
   * Save Excel file with improved error handling
   */
  private saveAsExcelFile(buffer: any, fileName: string): boolean {
    try {
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url: string = window.URL.createObjectURL(data);
      const link: HTMLAnchorElement = document.createElement('a');

      link.href = url;
      link.download = `${fileName}.xlsx`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      return true;
    } catch (error) {
      console.error('Error saving Excel file:', error);
      return false;
    }
  }

  /**
   * Generate PDF with improved formatting and error handling
   */
  generatePDF(data: any[], fileName: string, title?: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn('No data provided for PDF generation');
          resolve(false);
          return;
        }

        const doc = new jsPDF();
        let yPosition = 20;

        // Add title if provided
        if (title) {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text(title, 20, yPosition);
          yPosition += 20;
        }

        // Reset font for content
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        // Add data to PDF
        data.forEach((item, index) => {
          if (yPosition > 270) { // Check if we need a new page
            doc.addPage();
            yPosition = 20;
          }

          const content = typeof item === 'string'
            ? item
            : JSON.stringify(item, null, 2);

          doc.text(`${index + 1}. ${content}`, 20, yPosition);
          yPosition += 10;
        });

        doc.save(`${fileName}.pdf`);
        resolve(true);
      } catch (error) {
        console.error('Error generating PDF:', error);
        resolve(false);
      }
    });
  }

  /**
   * Format date to South African format
   */
  formatDate(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return '';
      }
      return dateObj.toLocaleDateString('en-ZA');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  /**
   * Utility method to check if user is online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }
}
