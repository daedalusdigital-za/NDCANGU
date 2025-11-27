import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/api/base-api.service';

/**
 * Training API Service
 *
 * Handles all training-related API calls (trainers, sessions, etc.).
 * Extracted from monolithic database.service.ts
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {
  private readonly TRAINING_ENDPOINTS = {
    // Trainers
    TRAINERS: '/Trainer',
    TRAINER_BY_ID: '/Trainer',
    TRAINER_BY_PROVINCE: '/Trainer/province',
    TRAINER_BY_STATUS: '/Trainer/status',
    TRAINER_STATS: '/Trainer/stats',

    // Training Sessions
    SESSIONS: '/Training',
    SESSION_BY_ID: '/Training',
    SESSIONS_BY_TRAINER: '/Training/trainer',
    SESSIONS_BY_PROVINCE: '/Training/province',
    SESSIONS_BY_DATE: '/Training/date-range',
    SESSIONS_BY_STATUS: '/Training/status'
  };

  constructor(private baseService: BaseService) { }

  // =============================================
  // TRAINER ENDPOINTS
  // =============================================

  /**
   * Get all trainers
   */
  getTrainers(): Observable<any> {
    return this.baseService.baseGet(this.TRAINING_ENDPOINTS.TRAINERS);
  }

  /**
   * Get trainer by ID
   */
  getTrainerById(id: number): Observable<any> {
    return this.baseService.baseGet(`${this.TRAINING_ENDPOINTS.TRAINER_BY_ID}/${id}`);
  }

  /**
   * Get trainers by province
   */
  getTrainersByProvince(province: string): Observable<any> {
    return this.baseService.baseGet(`${this.TRAINING_ENDPOINTS.TRAINER_BY_PROVINCE}/${province}`);
  }

  /**
   * Get trainers by status
   */
  getTrainersByStatus(status: string): Observable<any> {
    return this.baseService.baseGet(`${this.TRAINING_ENDPOINTS.TRAINER_BY_STATUS}/${status}`);
  }

  /**
   * Get trainer statistics
   */
  getTrainerStats(): Observable<any> {
    return this.baseService.baseGet(this.TRAINING_ENDPOINTS.TRAINER_STATS);
  }

  /**
   * Create new trainer
   */
  createTrainer(trainer: any): Observable<any> {
    return this.baseService.basePost(this.TRAINING_ENDPOINTS.TRAINERS, trainer);
  }

  /**
   * Update trainer
   */
  updateTrainer(trainer: any): Observable<any> {
    return this.baseService.basePut(`${this.TRAINING_ENDPOINTS.TRAINER_BY_ID}/${trainer.id}`, trainer);
  }

  /**
   * Delete trainer
   */
  deleteTrainer(id: number): Observable<any> {
    return this.baseService.baseDelete(`${this.TRAINING_ENDPOINTS.TRAINER_BY_ID}/${id}`);
  }

  // =============================================
  // TRAINING SESSION ENDPOINTS
  // =============================================

  /**
   * Get all training sessions
   */
  getTrainingSessions(): Observable<any> {
    return this.baseService.baseGet(this.TRAINING_ENDPOINTS.SESSIONS);
  }

  /**
   * Get training session by ID
   */
  getTrainingSessionById(id: number): Observable<any> {
    return this.baseService.baseGet(`${this.TRAINING_ENDPOINTS.SESSION_BY_ID}/${id}`);
  }

  /**
   * Get training sessions by trainer
   */
  getSessionsByTrainer(trainerId: number): Observable<any> {
    return this.baseService.baseGet(`${this.TRAINING_ENDPOINTS.SESSIONS_BY_TRAINER}/${trainerId}`);
  }

  /**
   * Get training sessions by province
   */
  getSessionsByProvince(province: string): Observable<any> {
    return this.baseService.baseGet(`${this.TRAINING_ENDPOINTS.SESSIONS_BY_PROVINCE}/${province}`);
  }

  /**
   * Get training sessions by date range
   */
  getSessionsByDateRange(startDate: string, endDate: string): Observable<any> {
    return this.baseService.baseGet(
      `${this.TRAINING_ENDPOINTS.SESSIONS_BY_DATE}?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Get training sessions by status
   */
  getSessionsByStatus(status: number): Observable<any> {
    return this.baseService.baseGet(`${this.TRAINING_ENDPOINTS.SESSIONS_BY_STATUS}/${status}`);
  }

  /**
   * Create new training session
   */
  createTrainingSession(session: any): Observable<any> {
    return this.baseService.basePost(this.TRAINING_ENDPOINTS.SESSIONS, session);
  }

  /**
   * Update training session
   */
  updateTrainingSession(session: any): Observable<any> {
    return this.baseService.basePut(`${this.TRAINING_ENDPOINTS.SESSION_BY_ID}/${session.id}`, session);
  }

  /**
   * Delete training session
   */
  deleteTrainingSession(id: number): Observable<any> {
    return this.baseService.baseDelete(`${this.TRAINING_ENDPOINTS.SESSION_BY_ID}/${id}`);
  }
}

