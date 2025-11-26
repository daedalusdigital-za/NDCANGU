import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastrService: ToastrService) { }

  intercept( request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((httpErrorResponse: HttpErrorResponse, _: Observable<HttpEvent<any>>) => {
        
          if (httpErrorResponse.status === 401) {
            localStorage.clear();
            this.router.navigate(['']);
          }
          
          if(httpErrorResponse.error){
            console.log('errrr');
            
            this.toastrService.error(httpErrorResponse?.error?.message || httpErrorResponse?.error || 'Something went wrong')
          }
          return throwError(() => httpErrorResponse);
        }
      )
    );
  }
}
