import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LockUserComponent } from './lock-user/lock-user.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { OneComponent } from './one/one.component';
import { TwoComponent } from './two/two.component';
import { FailureComponent } from './failure/failure.component';
import { ErorComponent } from './eror/eror.component';


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
  {
    path: 'lock-user',
    component: LockUserComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'one',
    component: OneComponent
  },
  {
    path: 'two',
    component: TwoComponent
  },
  {
    path: 'failure',
  },
  {
    path: 'eror',
  },
  {
    path: '', redirectTo: 'auth', pathMatch: 'full'
  }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
