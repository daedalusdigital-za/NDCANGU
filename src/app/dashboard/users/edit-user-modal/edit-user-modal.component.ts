import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit, OnChanges {
  @Input() userId: string = '';
  @Input() userData: any = null;
  @Input() isVisible: boolean = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() userUpdateSuccess = new EventEmitter<void>();

  isLoading = false;
  user = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    positionName: '',
    positionDesc: ''
  };

  constructor(
    private baseService: BaseService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.userData) {
      this.populateUserData();
    } else if (this.userId) {
      this.loadUserData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.populateUserData();
    } else if (changes['isVisible'] && this.isVisible && this.userId && !this.userData) {
      this.loadUserData();
    }
  }

  private populateUserData(): void {
    if (this.userData) {
      this.user = {
        id: this.userData.id || this.userId,
        firstName: this.userData.firstName || '',
        lastName: this.userData.lastName || '',
        phoneNumber: this.userData.phoneNumber || '',
        email: this.userData.email || '',
        positionName: this.userData.positionName || '',
        positionDesc: this.userData.positionDesc || ''
      };
    }
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.baseService.baseGet(`User/GetUserById?id=${this.userId}`).subscribe({
      next: (response: any) => {
        this.user = {
          id: response.id || this.userId,
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          phoneNumber: response.phoneNumber || '',
          email: response.email || '',
          positionName: response.positionName || '',
          positionDesc: response.positionDesc || ''
        };
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user data:', error);
        this.toastrService.error('Failed to load user data', 'Error');
        this.isLoading = false;
      }
    });
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      this.toastrService.warning('Please fill in all required fields', 'Validation Error');
      return;
    }

    this.isLoading = true;

    const userData = {
      id: this.user.id,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      positionName: this.user.positionName,
      positionDesc: this.user.positionDesc
    };

    this.baseService.basePatch('User/UpdateUser', userData).subscribe({
      next: (response: any) => {
        this.toastrService.success('User updated successfully!', 'Success');
        this.isLoading = false;
        this.userUpdateSuccess.emit();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Update error:', error);
        this.toastrService.error(
          error.error?.message || 'Failed to update user. Please try again.',
          'Error'
        );
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.modalClose.emit();
  }
}
