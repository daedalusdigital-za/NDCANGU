import { Component, OnInit } from '@angular/core'; import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { IColumns } from 'src/app/shared/interfaces/dynamic-grid-interfaces';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
  providers: [ConfirmationService]
})
export class ListUsersComponent implements OnInit {

  source: Array<any> = [];
  cols: IColumns[] = [{
    header: 'Name',
    field: 'firstName',
    isAction: false,
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
    onClick: (item: any) => {
      console.log(item);
    }
  },
  {
    header: 'Surname',
    field: 'lastName',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },

  {
    header: 'Email',
    field: 'email',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Contact No',
    field: 'phoneNumber',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Job',
    field: 'positionName',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'Type',
    field: 'positionDesc',
    isFilter: false,
    isSortable: false,
    getValue: function (item: any) {
      return item[this.field]
    },
  },
  {
    header: 'View/Edit',
    field: 'View/Edit',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      this.openEditModal(item);
    },
    getValue: function () {
      return this.field
    },
  },
  {
    header: 'Reset Password',
    field: 'Reset Password',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      this.confirmResetPassword(item);
    },
    getValue: function () {
      return this.field
    },
  },
  {
    header: 'Change Password',
    field: 'Change Password',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      this.openChangePasswordModal(item);
    },
    getValue: function () {
      return this.field
    },
  },
  {
    header: 'Delete',
    field: 'Delete',
    isAction: true,
    isFilter: false,
    isSortable: false,
    onClick: (item: any) => {
      this.confirm(item.id);
    },
    getValue: function () {
      return this.field
    },
  },
  ];

  // Password management
  showPasswordModal = false;
  selectedUser: any = null;

  // Edit user management
  showEditModal = false;
  selectedEditUser: any = null;

  constructor(
    private baseService: BaseService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  private getUsers() {
    // In development mode, provide mock data if API fails
    this.baseService.baseGet('User/GetUsers').subscribe({
      next: (response: any) => {
        this.source = response;
        console.log('Users loaded successfully:', response);
      },
      error: (error: any) => {
        console.error('Error loading users, using mock data:', error);
        // Provide mock user data for development
        this.source = this.getMockUsers();
        this.toastrService.info('Using demo user data (API unavailable)');
      }
    });
  }

  private getMockUsers() {
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        positionName: 'Administrator',
        positionDesc: 'System Administrator'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+1234567891',
        positionName: 'Nurse',
        positionDesc: 'Registered Nurse'
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        phoneNumber: '+1234567892',
        positionName: 'Doctor',
        positionDesc: 'General Practitioner'
      },
      {
        id: '4',
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@example.com',
        phoneNumber: '+1234567893',
        positionName: 'Technician',
        positionDesc: 'Lab Technician'
      },
      {
        id: '5',
        firstName: 'Mike',
        lastName: 'Brown',
        email: 'mike.brown@example.com',
        phoneNumber: '+1234567894',
        positionName: 'Manager',
        positionDesc: 'Operations Manager'
      }
    ];
  }

  edit(item: any) {
    console.log(item);

  }

  private confirm(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        console.log('Deleting user with ID:', id);
        this.baseService.baseDelete(`User/Delete?id=${id}`).subscribe({
          next: (response: any) => {
            console.log('Delete response:', response);
            this.toastrService.success('User deleted successfully!', 'Success');
            this.getUsers(); // Refresh the list
          },
          error: (error: any) => {
            console.error('Delete error:', error);
            this.toastrService.error('Failed to delete user. Please try again.', 'Error');
          }
        })
      },
      reject: () => {
        console.log('Delete cancelled by user');
      }
    });
  }

  confirmResetPassword(user: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to reset the password for ${user.firstName} ${user.lastName}? The password will be reset to the default: 654724135`,
      header: 'Reset Password Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resetPassword(user.id);
      },
      reject: () => {
        console.log('Password reset cancelled');
      }
    });
  }

  private resetPassword(userId: string) {
    this.baseService.basePost(`User/ResetPassword?userId=${userId}`, {}).subscribe({
      next: (response: any) => {
        console.log('Password reset response:', response);
        this.toastrService.success(
          'Password has been reset to: 654724135',
          'Password Reset Successful',
          { timeOut: 10000 }
        );
      },
      error: (error: any) => {
        console.error('Password reset error:', error);
        this.toastrService.error(
          error.error?.message || 'Failed to reset password. Please try again.',
          'Error'
        );
      }
    });
  }

  openChangePasswordModal(user: any) {
    this.selectedUser = user;
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.selectedUser = null;
  }

  onPasswordChangeSuccess() {
    this.toastrService.success('Password changed successfully!');
    this.closePasswordModal();
  }

  openEditModal(user: any) {
    this.selectedEditUser = user;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEditUser = null;
  }

  onUserUpdateSuccess() {
    this.toastrService.success('User updated successfully!');
    this.closeEditModal();
    this.getUsers(); // Refresh the list
  }

}
