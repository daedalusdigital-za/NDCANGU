import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginUserComponent } from './login/login.component';
import { LockUserComponent } from '../lock-user/lock-user.component';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginUserComponent,
    LockUserComponent,
    RegisterComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
  ]
})
export class AuthModule { }
