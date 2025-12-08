import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface TrainingSession {
  id?: number;
  trainingName: string;
  trainingType: string;
  startDate: Date;
  endDate: Date;
  province: string;
  provinceId?: number;
  provinceName?: string;
  venue: string;
  trainerId: number;
  trainer?: {
    id: number;
    name: string;
    email?: string;
    provinceName?: string;
  };
  targetAudience: string;
  numberOfParticipants: number;
  status: number;
  statusText?: string;
  hospital?: string;
  trainingObjectives?: string;
  trainingMaterials?: string;
  dateCreated: Date;
  lastUpdated?: Date;
  createdByUserName?: string;
}

export interface TrainingDocument {
  id: number;
  trainingSessionId: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  filePath?: string;
  fileUrl?: string;
  documentType: 'Register' | 'AttendanceSheet' | 'Materials';
  mimeType: string;
  uploadedBy: string | number;
  uploadedAt: Date;
}

export interface TrainingDocumentsResponse {
  trainingSessionId: number;
  documents: TrainingDocument[];
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private readonly apiUrl = 'https://ngcanduapi.azurewebsites.net/api/Training';

  // Status mapping
  private statusMap: { [key: number]: string } = {
    1: 'Scheduled',
    2: 'In Progress',
    3: 'Completed',
    4: 'Cancelled'
  };

  constructor(private http: HttpClient) {}

  /**
   * Get all training sessions
   */
  getAllSessions(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/GetAll`);
  }

  /**
   * Get training session by ID
   */
  getSessionById(id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.apiUrl}/GetById`, {
      params: new HttpParams().set('id', id.toString())
    });
  }

  /**
   * Get training sessions by province
   */
  getSessionsByProvince(provinceName: string): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/GetByProvince`, {
      params: new HttpParams().set('provinceName', provinceName)
    });
  }

  /**
   * Get training sessions by date range
   */
  getSessionsByDateRange(startDate: Date, endDate: Date): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/GetByDateRange`, {
      params: new HttpParams()
        .set('startDate', startDate.toISOString())
        .set('endDate', endDate.toISOString())
    });
  }

  /**
   * Get training sessions by trainer ID
   */
  getSessionsByTrainer(trainerId: number): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/GetByTrainer`, {
      params: new HttpParams().set('trainerId', trainerId.toString())
    });
  }

  /**
   * Add new training session (requires JWT token)
   */
  addSession(session: TrainingSession, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add`, session, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Update training session (requires JWT token)
   */
  updateSession(session: TrainingSession, token: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Update`, session, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Delete training session (requires JWT token)
   */
  deleteSession(id: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete`, {
      params: new HttpParams().set('id', id.toString()),
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Upload PDF document (requires JWT token)
   */
  uploadPDF(
    trainingSessionId: number,
    file: File,
    documentType: 'Register' | 'AttendanceSheet' | 'Materials',
    token: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('trainingSessionId', trainingSessionId.toString());
    formData.append('file', file);
    formData.append('documentType', documentType);

    return this.http.post(`${this.apiUrl}/UploadPDF`, formData, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      catchError(error => {
        console.error('Upload PDF error:', error);
        // Add specific error handling for common cases
        if (error.status === 400) {
          error.userMessage = 'Invalid file or request. Please check file size and format.';
        } else if (error.status === 401) {
          error.userMessage = 'Authentication failed. Please login again.';
        } else if (error.status === 404) {
          error.userMessage = 'Training session not found.';
        } else if (error.status === 413) {
          error.userMessage = 'File is too large. Maximum size is 10MB.';
        } else if (error.status >= 500) {
          error.userMessage = 'Server error. Please try again later.';
        }
        throw error;
      })
    );
  }

  /**
   * Download PDF document
   */
  downloadPDF(documentId: number, fileName: string): void {
    this.http.get(`${this.apiUrl}/DownloadPDF/${documentId}`, {
      responseType: 'blob'
    }).subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => console.error('Download failed:', error)
    );
  }

  /**
   * Get training documents for a session
   */
  getSessionDocuments(trainingSessionId: number): Observable<TrainingDocument[]> {
    return this.http.get<TrainingDocumentsResponse>(
      `${this.apiUrl}/${trainingSessionId}/PDFs`
    ).pipe(
      map(response => response.documents || []),
      catchError(error => {
        console.error('Error fetching training documents:', error);
        // Return empty array if API endpoint is not implemented yet
        if (error.status === 400 || error.status === 404 || error.status === 500) {
          return of([]);
        }
        throw error;
      })
    );
  }

  /**
   * Delete training document (requires JWT token)
   */
  deleteDocument(documentId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeletePDF/${documentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Get status text for status code
   */
  getStatusText(status: number): string {
    return this.statusMap[status] || 'Unknown';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
