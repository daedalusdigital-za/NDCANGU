import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, User } from '../../shared/interfaces/common.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<User>> {
    // In development mode, provide a fallback mock authentication for specific test emails
    if (!environment.production && this.shouldUseMockAuth(credentials)) {
      return this.getMockAuthResponse(credentials);
    }

    return this.http.post<any>(`${this.API_URL}Auth/Login`, credentials)
      .pipe(
        map(response => this.handleLoginResponse(response)),
        catchError(this.handleError.bind(this))
      );
  }

  private shouldUseMockAuth(credentials: { email: string; password: string }): boolean {
    // Use mock auth for specific test credentials or if API is unavailable
    const testEmails = ['admin@test.com', 'demo@test.com', 'test@test.com'];
    return testEmails.includes(credentials.email.toLowerCase());
  }

  private getMockAuthResponse(credentials: { email: string; password: string }): Observable<ApiResponse<User>> {
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      phoneNumber: '+1234567890',
      fullName: 'Test Administrator',
      role: ['Administrator'],
      token: 'mock-jwt-token-' + Date.now()
    };

    const mockResponse: ApiResponse<User> = {
      success: true,
      data: mockUser,
      message: 'Login successful'
    };

    console.log('Using mock authentication for development');
    return of(mockResponse);
  }

  register(userData: any): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.API_URL}Auth/Register`, userData)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError.bind(this))
      );
  }

  private handleLoginResponse(response: any): ApiResponse<User> {
    if (!response) {
      throw new Error('No response received from server');
    }

    // Check if response is already in ApiResponse format
    if (response.success !== undefined) {
      if (!response.success) {
        const errorMessage = response.message || response.errors?.[0] || 'Authentication failed';
        console.error('Authentication failed with response:', response);
        throw new Error(errorMessage);
      }
      return response;
    }

    // Handle direct API response format (like from your API)
    if (response.token && response.email) {
      const user: User = {
        id: response.id?.toString() || '0',
        email: response.email,
        phoneNumber: response.phoneNumber || '',
        fullName: `${response.firstName || ''} ${response.lastName || ''}`.trim(),
        role: response.role || [],
        token: response.token
      };

      const apiResponse: ApiResponse<User> = {
        success: true,
        data: user,
        message: 'Login successful'
      };

      // Transform response to ApiResponse format
      return apiResponse;
    }

    // If we can't determine the format, treat as error
    throw new Error('Invalid response format from server');
  }

  private handleResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (!response) {
      throw new Error('No response received from server');
    }

    if (!response.success) {
      const errorMessage = response.message || response.errors?.[0] || 'Authentication failed';
      console.error('Authentication failed with response:', response);
      throw new Error(errorMessage);
    }

    return response;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message || 'A client-side error occurred';
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = `Error Code: ${error.status || 'Unknown'}\nMessage: ${error.message}`;
      } else {
        errorMessage = `Server returned error code: ${error.status || 'Unknown'}`;
      }
    }

    console.error('Auth Service Error:', error);
    return throwError(() => errorMessage);
  }
}
