import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(
    private http: HttpClient
  ) { }

  basePost(url: string,payloads: any){
    return this.http.post(`${environment.apiBaseUrl}${url}`, payloads);
  }

  baseGet(url: string){
    return this.http.get(`${environment.apiBaseUrl}${url}`);
  }

  basePatch(url: string, payloads: any){
    return this.http.patch(`${environment.apiBaseUrl}${url}`, payloads);
  }

  baseDelete(url: string){
    return this.http.delete(`${environment.apiBaseUrl}${url}`);
  }
}
