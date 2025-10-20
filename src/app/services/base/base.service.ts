import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { ApiResponse } from '../../shared/interfaces/common.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private readonly API_URL = environment.apiBaseUrl;
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds

  constructor(private http: HttpClient) { }

  basePost<T>(url: string, payloads: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.API_URL}${url}`, payloads, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  baseGet<T>(url: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}${url}`, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      map(response => {
        console.log('BaseService - Raw response:', response);
        console.log('BaseService - Response type:', typeof response);
        console.log('BaseService - Is array:', Array.isArray(response));

        // If it's an array (like GetUsers), return it directly
        if (Array.isArray(response)) {
          console.log('BaseService - Returning array directly');
          return response;
        }

        // If it has the expected ApiResponse structure, handle accordingly
        if (response && typeof response === 'object' && 'success' in response) {
          console.log('BaseService - Has success property, handling as ApiResponse');
          return this.handleResponse(response);
        }

        // Otherwise, wrap it in ApiResponse format
        console.log('BaseService - Wrapping in ApiResponse format');
        return this.handleResponse(response);
      }),
      catchError(this.handleError)
    );
  }

  basePatch<T>(url: string, payloads: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.API_URL}${url}`, payloads, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  baseDelete<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.API_URL}${url}`, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.REQUEST_TIMEOUT),
      map(response => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
    // Normalize response format
    if (typeof response === 'object' && response !== null) {
      return {
        success: response.success !== false,
        data: response.data,
        message: response.message,
        errors: response.errors
      };
    }

    // If response is not in expected format, wrap it
    return {
      success: true,
      data: response as T,
      message: 'Success'
    };
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action';
          break;
        case 404:
          errorMessage = 'The requested resource was not found';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 0:
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
