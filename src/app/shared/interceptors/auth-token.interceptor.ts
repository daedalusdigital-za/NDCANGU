import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private globalService: GlobalService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
     // Exclude login and register URLs from interception
    //  if (request.url.includes('/login') || request.url.includes('/register')) {
        // return next.handle(request);
    //   }

    // Get the token from localStorage or any other source
    const user = this.globalService.getLocalStorage('currentUser');
    // If token exists, append it to the request headers
    if (user && user.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }

    // Pass the modified request to the next interceptor or the HttpClient
    return next.handle(request);
  }
}
