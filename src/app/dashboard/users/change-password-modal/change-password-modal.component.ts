import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent {
  @Input() userId = '';
  @Input() userName = '';
  @Input() isVisible = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() passwordChangeSuccess = new EventEmitter<void>();

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private baseService: BaseService,
    private toastrService: ToastrService
  ) {}

  closeModal() {
    this.resetForm();
    this.modalClose.emit();
  }

  changePassword() {
    // Validation
    if (!this.newPassword || !this.confirmPassword) {
      this.toastrService.error('Please fill in all fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastrService.error('New password and confirm password do not match');
      return;
    }

    if (this.newPassword.length < 8) {
      this.toastrService.error('Password must be at least 8 characters long');
      return;
    }

    const payload = {
      userId: parseInt(this.userId),
      newPassword: this.newPassword
    };

    this.isLoading = true;

    this.baseService.basePost('User/ChangePassword', payload).subscribe({
      next: () => {
        this.toastrService.success('Password changed successfully!');
        this.resetForm();
        this.passwordChangeSuccess.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.toastrService.error(
          error.error?.message || 'Failed to change password. Please try again.'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  togglePasswordVisibility(field: 'new' | 'confirm') {
    switch(field) {
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
}
