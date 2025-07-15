import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { User } from 'src/app/shared/interfaces/common.interfaces';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  user: User | null;
  flagText: string = 'KwaZulu-Natal';
  flagImg: string = 'assets/images/flags/italy.png';
  isMenuShown: boolean = false;
  isNurseUser: boolean = false;
  districts: Array<string> = ['EHLANZENI', 'GERT SIBANDE', 'NKANGALA'];
  pdflink: string = 'assets/pdfs/Mpumalanga.pdf';
  
  constructor(
    private globalService: GlobalService,
    private router: Router
  ) {
    this.user = this.globalService.getLocalStorage<User>('currentUser');
    this.globalService.selectedProvince = this.flagText;
    this.globalService.selectedDistricts = this.districts;
    
    if (this.user) {
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      if (this.user.role?.[0] == 'Admin') {
        this.isMenuShown = true;
      } else if (this.user.role?.[0] == 'Nurse') {
        this.isNurseUser = true;
      }

      this.districts = this.globalService.getDistricts(this.flagText);
      this.pdflink = `assets/pdfs/${this.flagText}.pdf`;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeDropdownInteractions();
  }

  ngOnDestroy(): void {
    this.removeDropdownListeners();
  }

  private initializeDropdownInteractions(): void {
    // Add keyboard navigation for dropdowns
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    
    // Add click outside listeners
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  private removeDropdownListeners(): void {
    document.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    // Global search shortcut (Ctrl + K)
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Escape key to close dropdowns
    if (event.key === 'Escape') {
      this.closeAllDropdowns();
    }
  }

  private handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeAllDropdowns();
    }
  }

  private closeAllDropdowns(): void {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  }

  // Enhanced province change handler
  changeFlagItem(img: string, text: string): void {
    this.flagImg = img;
    this.flagText = text;
    this.pdflink = `assets/pdfs/${text}.pdf`;
    this.districts = this.globalService.getDistricts(text);
    
    this.globalService.selectedProvince = this.flagText;
    this.globalService.selectedDistricts = this.districts;
    
    // Add animation feedback
    this.showNotification(`Province changed to ${text}`, 'success');
  }

  // Enhanced menu changes handler
  menuChanges(item: any): void {
    this.globalService.topMenuSubject.next(item);
    this.showNotification(`District changed to ${this.districts[item]}`, 'info');
  }

  // Show notification feedback
  private showNotification(message: string, type: 'success' | 'info' | 'warning' | 'error'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'info': return 'info-circle';
      case 'warning': return 'exclamation-triangle';
      case 'error': return 'exclamation-circle';
      default: return 'info-circle';
    }
  }

  // Enhanced logout with confirmation
  Logout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      this.showNotification('Logging out...', 'info');
      setTimeout(() => {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      }, 1000);
    }
  }

}
