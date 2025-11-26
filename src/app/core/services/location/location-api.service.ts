import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../api/base-api.service';

/**
 * Location API Service
 *
 * Handles all location-related API calls (provinces, districts, facilities).
 * Extracted from monolithic database.service.ts
 */
@Injectable({
  providedIn: 'root'
})
export class LocationApiService {
  private readonly LOCATION_ENDPOINTS = {
    PROVINCES: '/Location/provinces',
    DISTRICTS: '/Location/districts',
    FACILITIES: '/Location/facilities'
  };

  constructor(private baseService: BaseService) { }

  /**
   * Get all provinces
   */
  getProvinces(): Observable<any> {
    return this.baseService.baseGet(this.LOCATION_ENDPOINTS.PROVINCES);
  }

  /**
   * Get all districts
   */
  getDistricts(): Observable<any> {
    return this.baseService.baseGet(this.LOCATION_ENDPOINTS.DISTRICTS);
  }

  /**
   * Get all health facilities
   */
  getFacilities(): Observable<any> {
    return this.baseService.baseGet(this.LOCATION_ENDPOINTS.FACILITIES);
  }
}
