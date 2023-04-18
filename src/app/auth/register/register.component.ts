import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {

  user = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  }
  confirmPassword: string = '';

  isPasswordHidden: boolean = true;
  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {}

  registerUser() {    
    this.authService.register(this.user).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigateByUrl('/auth/login')
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

}
