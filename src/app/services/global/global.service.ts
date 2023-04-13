import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor( ) { }

  getLocalStorage(key: string){
    return localStorage.getItem(key);
  }

  setLocalStorage(key: string, value: JSON){
    return localStorage.setItem(key, JSON.stringify(value));
  }

  
}
