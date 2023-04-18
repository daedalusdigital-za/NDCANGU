import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '', // not show in update
    positionName: '',
    positionDesc: '',
    contactName: '',
    contactTypeName: '',
    contactDataTypeName: '',
    contactEntityName: ''
  }

  id: any;
  constructor(private router: Router, private baseService: BaseService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this._route?.snapshot.paramMap.get('id');
    if(this.id){
      this.getUserById()
    }
    
  }

  private getUserById(){
    this.baseService.baseGet(`User/GetUserById?id=${this.id}`).subscribe({
      next: (response: any)=>{
        this.user = response
      }
    })
  }

  addEditUser(){
    if(this.id){
      const payloads = {
        id: this.id,
        firstName : this.user.firstName,
        lastName : this.user.lastName,
        phoneNumber: this.user.phoneNumber,
        positionId: 0,
        roles: [1]
      }
      this.baseService.basePatch('User/UpdateUser', payloads).subscribe({
        next: (response)=>{
          this.router.navigateByUrl('/dashboard/users')
        }
      })
    } else {
      this.baseService.basePost('User/GetUsers', this.user).subscribe({
        next: (response)=>{
          this.router.navigateByUrl('/dashboard/users')
        }
      })
    }
   
    
  }

}
