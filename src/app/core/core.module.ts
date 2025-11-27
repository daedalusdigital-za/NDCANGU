import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

// Services
import { AuthService } from './services/auth/auth.service';
import { BaseService } from './services/api/base-api.service';
import { ErrorHandlingService } from './services/error-handling/error-handling.service';
import { GlobalService } from './services/storage/global.service';
import { LoaderService } from './services/ui/loader.service';
import { LoadingService } from './services/ui/loading.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';

/**
 * CoreModule
 *
 * Provides application-wide singleton services, guards, and interceptors.
 * Should be imported only once in AppModule using forRoot() pattern.
 *
 * Includes:
 * - Authentication services
 * - HTTP base service
 * - Global state/storage service
 * - Error handling
 * - Loading indicators
 * - Route guards
 * - HTTP interceptors
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    // Core Services (Singletons)
    AuthService,
    BaseService,
    ErrorHandlingService,
    GlobalService,
    LoaderService,
    LoadingService,

    // PrimeNG Services
    ConfirmationService,
    MessageService,
    DialogService,

    // Guards
    AuthGuard,

    // HTTP Interceptors (order matters!)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import only once in AppModule'
      );
    }
  }
}
