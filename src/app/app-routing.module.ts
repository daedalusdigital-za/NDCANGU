import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LockUserComponent } from './shared/components/lock-user/lock-user.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

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
