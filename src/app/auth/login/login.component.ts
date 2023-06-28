import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalService } from '../../services/global/global.service';
import { TermsComponent } from 'src/app/auth/terms/terms.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService],
})
export class LoginUserComponent implements OnInit {
  user: any = {
    email: '',
    password: '',
  }

  isPasswordHidden: boolean = true;
  constructor(private authService: AuthService, private globalService: GlobalService,
    private router: Router, private dialogService: DialogService) { }

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

  openTermsModal(){
    console.log('openTermsModal');

    this.dialogService.open(TermsComponent, {
      header: `Terms of Use`,
      width: '70%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000,
      // data: item.id
  });
    
  }

}
