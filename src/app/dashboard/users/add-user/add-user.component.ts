import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { ToastrService } from 'ngx-toastr';

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

  provinces: any;
  districts: any;
  id: any;
  isLoading = false;

  constructor(
    private router: Router,
    private baseService: BaseService,
    private _route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.id = this._route?.snapshot.paramMap.get('id');
    if(this.id){
      this.getUserById()
    }
  }

  private getUserById(){
    console.log('Getting user by ID:', this.id);
    this.baseService.baseGet(`User/GetUserById?id=${this.id}`).subscribe({
      next: (response: any)=>{
        console.log('User data received:', response);
        // Handle both direct response and wrapped response
        if (response && response.data) {
          this.user = response.data;
        } else if (response) {
          this.user = response;
        }
      },
      error: (error: any) => {
        console.error('Error getting user:', error);
        this.toastr.error('Failed to load user data', 'Error');
      }
    })
  }

  addEditUser(){
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    if(this.id){
      // Update user
      const payloads = {
        id: this.id,
        firstName : this.user.firstName,
        lastName : this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        positionId: 1,
        roles: [1]
      }

      console.log('Updating user with payload:', payloads);
      this.baseService.basePatch('User/UpdateUser', payloads).subscribe({
        next: (response)=>{
          console.log('User updated successfully:', response);
          this.isLoading = false;
          this.toastr.success('User updated successfully!', 'Success');
          this.router.navigateByUrl('/dashboard/users');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.isLoading = false;
          this.toastr.error('Failed to update user. Please try again.', 'Error');
        }
      })
    } else {
      // Add new user - using the schema you provided
      const newUserPayload = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        password: this.user.password
      };

      console.log('Adding new user with payload:', newUserPayload);
      this.baseService.basePost('User/Add', newUserPayload).subscribe({
        next: (response)=>{
          console.log('User added successfully:', response);
          this.isLoading = false;
          this.toastr.success('User added successfully!', 'Success');
          this.router.navigateByUrl('/dashboard/users');
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.isLoading = false;
          this.toastr.error('Failed to add user. Please try again.', 'Error');
        }
      })
    }
  }

  private validateForm(): boolean {
    if (!this.user.firstName?.trim()) {
      this.toastr.warning('First name is required', 'Validation Error');
      return false;
    }

    if (!this.user.lastName?.trim()) {
      this.toastr.warning('Last name is required', 'Validation Error');
      return false;
    }

    if (!this.user.email?.trim()) {
      this.toastr.warning('Email is required', 'Validation Error');
      return false;
    }

    if (!this.isValidEmail(this.user.email)) {
      this.toastr.warning('Please enter a valid email address', 'Validation Error');
      return false;
    }

    if (!this.user.phoneNumber?.trim()) {
      this.toastr.warning('Phone number is required', 'Validation Error');
      return false;
    }

    // Only validate password for new users
    if (!this.id && !this.user.password?.trim()) {
      this.toastr.warning('Password is required', 'Validation Error');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
