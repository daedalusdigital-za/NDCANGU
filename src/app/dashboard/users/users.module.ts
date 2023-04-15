import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { GuiGridModule } from '@generic-ui/ngx-grid';
import { FormsModule } from '@angular/forms';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [
    ListUsersComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    GuiGridModule,
    UsersRoutingModule,
    FormsModule,
  ]
})
export class UsersModule { }
