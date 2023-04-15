import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LockUserComponent } from './lock-user/lock-user.component';
import { LoginUserComponent } from './auth/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AppComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'auth',
    component: AppComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  // {
  //   path: 'lock-user',
  //   component: LockUserComponent
  // },
  // {
  //   path: 'login',
  //   component: LoginUserComponent
  // },
  {
    path: '', redirectTo: 'auth', pathMatch: 'full'
  }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
