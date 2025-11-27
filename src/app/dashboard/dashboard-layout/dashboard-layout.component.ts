import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { User } from 'src/app/shared/interfaces/common.interfaces';

// Notification interface
interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  selected: boolean;
  category: string;
  hasActions?: boolean;
  primaryAction?: string;
  secondaryAction?: string;
}

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

  // Notification modal properties
  allNotifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  notificationSearchTerm: string = '';
  selectedNotificationFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  Math = Math; // Make Math available in template

  constructor(
    private globalService: GlobalService,
    private router: Router
  ) {
    this.user = this.globalService.getLocalStorage<User>('currentUser');
    this.globalService.selectedProvince = this.flagText;
    this.globalService.selectedDistricts = this.districts;

    if (this.user) {
      // Create fullName safely, handling undefined values
      const firstName = this.user.firstName || '';
      const lastName = this.user.lastName || '';

      if (firstName && lastName) {
        this.user.fullName = `${firstName} ${lastName}`;
      } else if (firstName) {
        this.user.fullName = firstName;
      } else if (lastName) {
        this.user.fullName = lastName;
      } else {
        this.user.fullName = this.user.email || 'Administrator';
      }

      if (this.user.role?.[0] == 'Admin') {
        this.isMenuShown = true;
      } else if (this.user.role?.[0] == 'Nurse') {
        this.isNurseUser = true;
      }

      // Location services removed - districts no longer available
      this.districts = [];
      this.pdflink = `assets/pdfs/${this.flagText}.pdf`;
    }
  }

  ngOnInit(): void {
    this.initializeNotifications();
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

    // Add dropdown toggle click listeners
    document.addEventListener('click', this.handleDropdownToggle.bind(this));
  }

  private removeDropdownListeners(): void {
    document.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    document.removeEventListener('click', this.handleDropdownToggle.bind(this));
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
    if (!target.closest('.nav-dropdown')) {
      this.closeAllDropdowns();
    }
  }

  handleDropdownToggle(event: Event): void {
    const target = event.target as HTMLElement;
    const toggle = target.closest('.nav-dropdown-toggle');

    if (toggle) {
      event.preventDefault();
      event.stopPropagation();

      const dropdownItem = toggle.closest('.nav-dropdown');

      if (dropdownItem) {
        // Close all other dropdowns first
        this.closeAllDropdowns();

        // Toggle current dropdown by adding show class to the nav-dropdown element
        dropdownItem.classList.add('show');
      }
    }
  }

  private closeAllDropdowns(): void {
    const dropdowns = document.querySelectorAll('.nav-dropdown.show');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  }

  // Enhanced province change handler
  changeFlagItem(img: string, text: string): void {
    this.flagImg = img;
    this.flagText = text;
    this.pdflink = `assets/pdfs/${text}.pdf`;

    // Location services removed - districts no longer available
    this.districts = [];
    this.globalService.selectedDistricts = this.districts;

    this.globalService.selectedProvince = this.flagText;

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

  // Notification Modal Methods
  private initializeNotifications(): void {
    // Generate sample notifications
    this.allNotifications = [
      {
        id: '1',
        type: 'success',
        title: 'Test Results Available',
        message: 'Blood test results for Patient P000123 are ready for review',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        read: false,
        selected: false,
        category: 'Medical',
        hasActions: true,
        primaryAction: 'View Results',
        secondaryAction: 'Download'
      },
      {
        id: '2',
        type: 'warning',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight at 2:00 AM. System will be unavailable for 2 hours.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: false,
        selected: false,
        category: 'System',
        hasActions: true,
        primaryAction: 'View Details',
        secondaryAction: 'Remind Me'
      },
      {
        id: '3',
        type: 'info',
        title: 'New Feature Available',
        message: 'Advanced reporting features are now live. Check out the new dashboard analytics.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: false,
        selected: false,
        category: 'Features',
        hasActions: true,
        primaryAction: 'Explore',
        secondaryAction: 'Learn More'
      },
      {
        id: '4',
        type: 'error',
        title: 'Failed Login Attempt',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        selected: false,
        category: 'Security',
        hasActions: true,
        primaryAction: 'Review',
        secondaryAction: 'Block IP'
      },
      {
        id: '5',
        type: 'success',
        title: 'Data Backup Complete',
        message: 'Daily backup completed successfully. All patient data has been securely backed up.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        selected: false,
        category: 'System'
      },
      // Appointment notifications removed - appointment endpoints not available in production API
      {
        id: '7',
        type: 'warning',
        title: 'Low Inventory Alert',
        message: 'Medical supplies running low: Blood pressure monitors (3 remaining)',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        read: true,
        selected: false,
        category: 'Inventory',
        hasActions: true,
        primaryAction: 'Order Now',
        secondaryAction: 'View Inventory'
      },
      {
        id: '8',
        type: 'info',
        title: 'Training Session',
        message: 'Monthly training session on new procedures scheduled for next week',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        selected: false,
        category: 'Training'
      }
    ];

    this.filterNotifications();
  }

  filterNotifications(): void {
    let filtered = this.allNotifications;

    // Apply search filter
    if (this.notificationSearchTerm.trim()) {
      const searchTerm = this.notificationSearchTerm.toLowerCase();
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm) ||
        notification.message.toLowerCase().includes(searchTerm) ||
        notification.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    if (this.selectedNotificationFilter !== 'all') {
      if (this.selectedNotificationFilter === 'unread') {
        filtered = filtered.filter(notification => !notification.read);
      } else {
        filtered = filtered.filter(notification => notification.type === this.selectedNotificationFilter);
      }
    }

    this.filteredNotifications = filtered;
    this.totalPages = Math.ceil(this.filteredNotifications.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  filterNotificationsByType(type: string): void {
    this.selectedNotificationFilter = type;
    this.filterNotifications();
  }

  markAllAsRead(): void {
    this.allNotifications.forEach(notification => {
      notification.read = true;
    });
    this.filterNotifications();
    this.showNotification('All notifications marked as read', 'success');
  }

  clearAllNotifications(): void {
    if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      this.allNotifications = [];
      this.filterNotifications();
      this.showNotification('All notifications cleared', 'info');
    }
  }

  toggleNotificationSelection(notification: Notification): void {
    notification.selected = !notification.selected;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      case 'error': return 'fas fa-exclamation-circle';
      default: return 'fas fa-info-circle';
    }
  }

  formatNotificationTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return timestamp.toLocaleDateString();
  }

  handleNotificationAction(notification: Notification, action: 'primary' | 'secondary'): void {
    const actionText = action === 'primary' ? notification.primaryAction : notification.secondaryAction;
    this.showNotification(`${actionText} clicked for: ${notification.title}`, 'info');

    // Mark notification as read when action is taken
    notification.read = true;
    this.filterNotifications();
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    this.filterNotifications();
    this.showNotification('Notification marked as read', 'success');
  }

  deleteNotification(notification: Notification): void {
    if (confirm('Are you sure you want to delete this notification?')) {
      const index = this.allNotifications.findIndex(n => n.id === notification.id);
      if (index > -1) {
        this.allNotifications.splice(index, 1);
        this.filterNotifications();
        this.showNotification('Notification deleted', 'info');
      }
    }
  }

  getSelectedNotifications(): Notification[] {
    return this.filteredNotifications.filter(n => n.selected);
  }

  markSelectedAsRead(): void {
    const selected = this.getSelectedNotifications();
    selected.forEach(notification => {
      notification.read = true;
      notification.selected = false;
    });
    this.filterNotifications();
    this.showNotification(`${selected.length} notifications marked as read`, 'success');
  }

  deleteSelectedNotifications(): void {
    const selected = this.getSelectedNotifications();
    if (selected.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selected.length} selected notifications?`)) {
      selected.forEach(notification => {
        const index = this.allNotifications.findIndex(n => n.id === notification.id);
        if (index > -1) {
          this.allNotifications.splice(index, 1);
        }
      });
      this.filterNotifications();
      this.showNotification(`${selected.length} notifications deleted`, 'info');
    }
  }

  refreshNotifications(): void {
    this.showNotification('Refreshing notifications...', 'info');
    // Simulate API call
    setTimeout(() => {
      this.initializeNotifications();
      this.showNotification('Notifications refreshed', 'success');
    }, 1000);
  }

  getEmptyStateMessage(): string {
    if (this.notificationSearchTerm.trim()) {
      return `No notifications found matching "${this.notificationSearchTerm}"`;
    }
    if (this.selectedNotificationFilter === 'unread') {
      return 'No unread notifications';
    }
    if (this.selectedNotificationFilter !== 'all') {
      return `No ${this.selectedNotificationFilter} notifications`;
    }
    return 'No notifications available';
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

}
