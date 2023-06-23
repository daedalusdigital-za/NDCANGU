import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginUserComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyPhoneNumberComponent } from './verify-phone-number/verify-phone-number.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginUserComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'verify',
        component: VerifyPhoneNumberComponent
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
