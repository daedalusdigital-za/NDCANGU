import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LockUserComponent } from './components/lock-user/lock-user.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TermsComponent } from './components/terms/terms.component';

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
    path: 'terms',
    component: TermsComponent
  },
  { path: '404',
   component: NotFoundComponent 
  },
  
  {
    path: '', redirectTo: 'auth', pathMatch: 'full'
  },
  { path: '**',
   redirectTo: '/404'
  } ,
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
