import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';
import { User } from '../interfaces/common.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private globalService: GlobalService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if token exists in localStorage
    const user = this.globalService.getLocalStorage<User>('currentUser');
    if (user && user.token) {
      // Token exists, allow access to the route
      return true;
    } else {
      // Token does not exist, navigate to login page or any other desired behavior
      this.router.navigate(['/auth']);
      return false;
    }
  }
}