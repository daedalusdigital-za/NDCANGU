import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  }
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
