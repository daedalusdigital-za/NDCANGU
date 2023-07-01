import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
//import { GlobalService } from '../../services/global/global.service';
//import { TermsComponent } from 'src/app/auth/terms/terms.component';
//import { DialogService } from 'primeng/dynamicdialog';

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
        this.router.navigate(['/auth/verify'], {
          state: {
            data: this.user.phoneNumber
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    })

  }
 // openTermsModal(){
  //  console.log('openTermsModal');

//    this.dialogService.open(TermsComponent, {
//      header: `Terms of Use`,
//      width: '70%',
    //  contentStyle: {"max-height": "500px", "overflow": "auto"},
  //    baseZIndex: 10000,
      // data: item.id
 // });
    
  //}
  

}
