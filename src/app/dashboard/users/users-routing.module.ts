import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ListUsersComponent } from './list-users/list-users.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListUsersComponent
      },
      {
        path: 'add',
        component: AddUserComponent
      },
      {
        path: 'edit/:id',
        component: AddUserComponent
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
