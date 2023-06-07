import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginUserComponent implements OnInit {
scrollModal(_t37: TemplateRef<any>) {
throw new Error('Method not implemented.');
}
  user: any = {
    email: '',
    password: '',
  }

  isPasswordHidden: boolean = true;
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
