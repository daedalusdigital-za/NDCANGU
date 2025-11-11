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
<<<<<<< HEAD
  constructor(
    private router: Router, 
    private baseService: BaseService, 
    private _route: ActivatedRoute,
    private toastrService: ToastrService
=======
  isLoading = false;

  constructor(
    private router: Router,
    private baseService: BaseService,
    private _route: ActivatedRoute,
    private toastr: ToastrService
>>>>>>> b30f7d52e1a7828ff9db385527faa3f97225b9b3
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
<<<<<<< HEAD
        this.user = response
      },
      error: (error: any) => {
        console.error('Error loading user, using mock data:', error);
        // Provide mock user data for development
        this.user = this.getMockUser(this.id);
        this.toastrService.info('Using demo user data (API unavailable)');
=======
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
>>>>>>> b30f7d52e1a7828ff9db385527faa3f97225b9b3
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
<<<<<<< HEAD
          this.toastrService.success('User updated successfully!');
          this.router.navigateByUrl('/dashboard/users')
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastrService.success('User updated successfully! (Demo mode)');
          this.router.navigateByUrl('/dashboard/users');
=======
          console.log('User updated successfully:', response);
          this.isLoading = false;
          this.toastr.success('User updated successfully!', 'Success');
          this.router.navigateByUrl('/dashboard/users');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.isLoading = false;
          this.toastr.error('Failed to update user. Please try again.', 'Error');
>>>>>>> b30f7d52e1a7828ff9db385527faa3f97225b9b3
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
<<<<<<< HEAD
          this.toastrService.success('User added successfully!');
          this.router.navigateByUrl('/dashboard/users')
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.toastrService.success('User added successfully! (Demo mode)');
          this.router.navigateByUrl('/dashboard/users');
=======
          console.log('User added successfully:', response);
          this.isLoading = false;
          this.toastr.success('User added successfully!', 'Success');
          this.router.navigateByUrl('/dashboard/users');
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.isLoading = false;
          this.toastr.error('Failed to add user. Please try again.', 'Error');
>>>>>>> b30f7d52e1a7828ff9db385527faa3f97225b9b3
        }
      })
    }
  }

<<<<<<< HEAD
  private getMockUser(id: string) {
    // Return mock user data based on id
    const mockUsers: any = {
      '1': {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        positionName: 'Administrator',
        positionDesc: 'System Administrator'
      },
      '2': {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+1234567891',
        positionName: 'Nurse',
        positionDesc: 'Registered Nurse'
      }
    };
    return mockUsers[id] || {
      id: id,
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      phoneNumber: '+1234567999',
      positionName: 'Staff',
      positionDesc: 'General Staff'
    };
=======
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
>>>>>>> b30f7d52e1a7828ff9db385527faa3f97225b9b3
  }
}
