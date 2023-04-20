import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { FormsModule } from '@angular/forms';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    ListUsersComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    FormsModule,
    ConfirmDialogModule,
    ButtonModule
  ]
})
export class UsersModule { }
