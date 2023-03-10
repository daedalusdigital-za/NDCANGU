import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginUserComponent } from './login-user/login-user.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AppComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'login',
    component: LoginUserComponent
  },
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
