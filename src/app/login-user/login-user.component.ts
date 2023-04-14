import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { GlobalService } from '../services/global/global.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent implements OnInit {
  user: any = {
    email: '',
    password: '',
  }
  constructor(private authService: AuthService, private globalService: GlobalService,
    private router: Router) { }

  ngOnInit(): void {}

  loginUser() {
    this.authService.login(this.user).subscribe({
      next: (response: any) => {
        console.log(response);
        this.globalService.setLocalStorage('currentUser', response);
        this.router.navigateByUrl('/dashboard')
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

}
