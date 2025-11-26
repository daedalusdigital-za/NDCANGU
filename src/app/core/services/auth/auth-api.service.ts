import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../api/base-api.service';

/**
 * Auth API Service
 *
 * Handles all authentication-related API calls.
 * Extracted from monolithic database.service.ts
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly AUTH_ENDPOINTS = {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    RESET_PASSWORD: '/Auth/reset-password',
    CHANGE_PASSWORD: '/Auth/change-password'
  };

  constructor(private baseService: BaseService) { }

  /**
   * Authenticate user with email and password
   */
  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.baseService.basePost(this.AUTH_ENDPOINTS.LOGIN, payload);
  }

  /**
   * Register a new user
   */
  register(userData: any): Observable<any> {
    return this.baseService.basePost(this.AUTH_ENDPOINTS.REGISTER, userData);
  }

  /**
   * Request password reset
   */
  resetPassword(resetData: any): Observable<any> {
    return this.baseService.basePost(this.AUTH_ENDPOINTS.RESET_PASSWORD, resetData);
  }

  /**
   * Change user password
   */
  changePassword(passwordData: any): Observable<any> {
    return this.baseService.basePost(this.AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
  }
}
