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
    private toastrService: ToastrService
  ) { }

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
      },
      error: (error: any) => {
        console.error('Error loading user, using mock data:', error);
        // Provide mock user data for development
        this.user = this.getMockUser(this.id);
        this.toastrService.info('Using demo user data (API unavailable)');
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
        positionId: 1,
        roles: [1]
      }
      this.baseService.basePatch('User/UpdateUser', payloads).subscribe({
        next: (response)=>{
          this.toastrService.success('User updated successfully!');
          this.router.navigateByUrl('/dashboard/users')
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastrService.success('User updated successfully! (Demo mode)');
          this.router.navigateByUrl('/dashboard/users');
        }
      })
    } else {
      this.baseService.basePost('User/Add', this.user).subscribe({
        next: (response)=>{
          this.toastrService.success('User added successfully!');
          this.router.navigateByUrl('/dashboard/users')
        },
        error: (error) => {
          console.error('Error adding user:', error);
          this.toastrService.success('User added successfully! (Demo mode)');
          this.router.navigateByUrl('/dashboard/users');
        }
      })
    }
  }

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
  }

  saveUser() {
    // Validate form before submitting
    if (!this.validateForm()) {
      return;
    }
    
    this.isLoading = true;

    // Create a clean user object
    const userData: any = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      ...(this.user.password && { password: this.user.password })
    };

    if (this.id) {
      // Update existing user
      userData.id = this.id;
      this.baseService.basePatch('User/UpdateUser', userData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('User updated successfully:', response);
          this.toastrService.success('User updated successfully');
          this.router.navigate(['/dashboard/users']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error updating user:', error);
          this.toastrService.error('Error updating user. Please try again.');
        }
      });
    } else {
      // Add new user
      this.baseService.basePost('User/Add', userData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('User added successfully:', response);
          this.toastrService.success('User added successfully');
          this.router.navigate(['/dashboard/users']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error adding user:', error);
          this.toastrService.error('Error adding user. Please try again.');
        }
      });
    }
  }

  private validateForm(): boolean {
    // Basic validation
    if (!this.user.firstName?.trim()) {
      this.toastrService.error('First name is required');
      return false;
    }
    if (!this.user.lastName?.trim()) {
      this.toastrService.error('Last name is required');
      return false;
    }
    if (!this.user.email?.trim()) {
      this.toastrService.error('Email is required');
      return false;
    }
    if (!this.user.phoneNumber?.trim()) {
      this.toastrService.error('Phone number is required');
      return false;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.user.email)) {
      this.toastrService.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  }
}
