import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginUserComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { LockUserComponent } from '../components/lock-user/lock-user.component';
import { VerifyPhoneNumberComponent } from './verify-phone-number/verify-phone-number.component';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  declarations: [
    LoginUserComponent,
    LockUserComponent,
    RegisterComponent,
    AuthComponent,
    VerifyPhoneNumberComponent,
    TermsComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
  ]
})
export class AuthModule { }
