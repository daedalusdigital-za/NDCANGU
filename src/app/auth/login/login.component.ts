import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalService } from '../../services/global/global.service';
import { ErrorHandlingService } from '../../services/error-handling/error-handling.service';
import { TermsComponent } from 'src/app/auth/terms/terms.component';
import { PrivacyPolicyComponent } from 'src/app/auth/privacy-policy/privacy-policy.component';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from '../../shared/interfaces/common.interfaces';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService],
})
export class LoginUserComponent implements OnInit {
  user: { email: string; password: string } = {
    email: '',
    password: '',
  };

  isPasswordHidden: boolean = true;
  isLoading: boolean = false;
  isProduction: boolean = environment.production;
  
  // Forgot Password Modal
  showForgotPasswordModal: boolean = false;
  forgotPasswordEmail: string = '';
  isForgotPasswordLoading: boolean = false;

  constructor(
    private authService: AuthService, 
    private globalService: GlobalService,
    private router: Router, 
    private dialogService: DialogService,
    private errorHandling: ErrorHandlingService
  ) { }

  ngOnInit(): void {}

  loginUser(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    
    this.authService.login(this.user).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.globalService.setLocalStorage('currentUser', response.data);
          this.errorHandling.showSuccess('Login successful!');
          this.router.navigateByUrl('/dashboard');
        } else {
          this.errorHandling.handleError(response.message || 'Login failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        
        // Handle different types of errors
        let errorMessage = 'Login failed. Please try again.';
        
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.errorHandling.handleError(errorMessage, 'Login');
      }
    });
  }

  private validateForm(): boolean {
    if (!this.user.email || !this.user.password) {
      this.errorHandling.showWarning('Please fill in all required fields');
      return false;
    }

    if (!this.isValidEmail(this.user.email)) {
      this.errorHandling.showWarning('Please enter a valid email address');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  openTermsModal(): void {
    this.dialogService.open(TermsComponent, {
      header: 'Terms of Use',
      width: '70%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000,
    });
  }

  openPrivacyPolicyModal(): void {
    this.dialogService.open(PrivacyPolicyComponent, {
      header: 'Privacy Policy',
      width: '70%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000,
    });
  }

  // Forgot Password Modal Methods
  openForgotPasswordModal(): void {
    this.showForgotPasswordModal = true;
    this.forgotPasswordEmail = this.user.email || '';
  }

  closeForgotPasswordModal(): void {
    this.showForgotPasswordModal = false;
    this.forgotPasswordEmail = '';
    this.isForgotPasswordLoading = false;
  }

  submitForgotPassword(): void {
    if (!this.forgotPasswordEmail || !this.isValidEmail(this.forgotPasswordEmail)) {
      this.errorHandling.showWarning('Please enter a valid email address');
      return;
    }

    this.isForgotPasswordLoading = true;
    
    // Simulate API call - replace with actual service call
    setTimeout(() => {
      this.isForgotPasswordLoading = false;
      this.errorHandling.showSuccess('Password reset instructions have been sent to your email address');
      this.closeForgotPasswordModal();
    }, 2000);
  }
}
