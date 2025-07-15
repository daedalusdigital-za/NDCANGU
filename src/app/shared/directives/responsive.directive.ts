import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, HostListener } from '@angular/core';
import { TouchGestureService } from '../../services/touch-gesture.service';

@Directive({
  selector: '[appResponsive]'
})
export class ResponsiveDirective implements OnInit, OnDestroy {
  @Input() touchFriendly: boolean = false;
  @Input() hideOnMobile: boolean = false;
  @Input() showOnMobile: boolean = false;
  @Input() stackOnMobile: boolean = false;
  @Input() mobileBreakpoint: number = 768;

  private resizeListener?: () => void;
  private isInitialized = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private touchGestureService: TouchGestureService
  ) {}

  ngOnInit(): void {
    this.initResponsiveFeatures();
    this.setupResizeListener();
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    
    if (this.touchFriendly) {
      this.touchGestureService.removeTouchGestures(this.el.nativeElement);
    }
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: Event): void {
    // Small delay to ensure orientation change is complete
    setTimeout(() => {
      this.checkScreenSize();
    }, 100);
  }

  private initResponsiveFeatures(): void {
    const element = this.el.nativeElement;

    // Add base responsive classes
    this.renderer.addClass(element, 'responsive-element');

    // Make touch-friendly if requested
    if (this.touchFriendly) {
      this.makeTouchFriendly();
    }

    // Add stack behavior for mobile
    if (this.stackOnMobile) {
      this.renderer.addClass(element, 'mobile-stack');
    }

    this.isInitialized = true;
  }

  private setupResizeListener(): void {
    this.resizeListener = () => {
      this.checkScreenSize();
    };
    window.addEventListener('resize', this.resizeListener);
  }

  private checkScreenSize(): void {
    if (!this.isInitialized) return;

    const element = this.el.nativeElement;
    const isMobile = window.innerWidth <= this.mobileBreakpoint;
    const isTablet = window.innerWidth > this.mobileBreakpoint && window.innerWidth <= 1024;
    const isDesktop = window.innerWidth > 1024;

    // Remove existing responsive classes
    this.renderer.removeClass(element, 'mobile-view');
    this.renderer.removeClass(element, 'tablet-view');
    this.renderer.removeClass(element, 'desktop-view');
    this.renderer.removeClass(element, 'mobile-hidden');
    this.renderer.removeClass(element, 'mobile-visible');

    // Add appropriate classes
    if (isMobile) {
      this.renderer.addClass(element, 'mobile-view');
      
      if (this.hideOnMobile) {
        this.renderer.addClass(element, 'mobile-hidden');
        this.renderer.setStyle(element, 'display', 'none');
      } else if (this.showOnMobile) {
        this.renderer.addClass(element, 'mobile-visible');
        this.renderer.removeStyle(element, 'display');
      }

      // Apply mobile-specific optimizations
      this.applyMobileOptimizations();
    } else if (isTablet) {
      this.renderer.addClass(element, 'tablet-view');
      this.applyTabletOptimizations();
    } else {
      this.renderer.addClass(element, 'desktop-view');
      this.applyDesktopOptimizations();
    }

    // Reset display if not hiding on mobile
    if (!this.hideOnMobile || !isMobile) {
      this.renderer.removeStyle(element, 'display');
    }
  }

  private makeTouchFriendly(): void {
    const element = this.el.nativeElement;
    
    // Use the touch gesture service to make element touch-friendly
    this.touchGestureService.makeTouchFriendly(element, {
      minHeight: 44,
      minWidth: 44,
      padding: 8
    });

    // Add visual touch feedback
    this.renderer.addClass(element, 'touch-feedback');
  }

  private applyMobileOptimizations(): void {
    const element = this.el.nativeElement;

    // Increase touch targets
    if (element.tagName.toLowerCase() === 'button' || element.classList.contains('btn')) {
      this.renderer.setStyle(element, 'min-height', '44px');
      this.renderer.setStyle(element, 'padding', '12px 16px');
    }

    // Optimize form controls
    if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'select') {
      this.renderer.setStyle(element, 'font-size', '16px'); // Prevents zoom on iOS
      this.renderer.setStyle(element, 'min-height', '44px');
    }

    // Optimize tables
    if (element.tagName.toLowerCase() === 'table') {
      this.renderer.addClass(element, 'table-responsive');
    }

    // Optimize cards
    if (element.classList.contains('card')) {
      this.renderer.addClass(element, 'mobile-card');
      this.renderer.setStyle(element, 'margin-bottom', '16px');
    }
  }

  private applyTabletOptimizations(): void {
    const element = this.el.nativeElement;

    // Tablet-specific optimizations
    if (element.classList.contains('card')) {
      this.renderer.setStyle(element, 'margin-bottom', '24px');
    }
  }

  private applyDesktopOptimizations(): void {
    const element = this.el.nativeElement;

    // Desktop-specific optimizations
    if (element.classList.contains('card')) {
      this.renderer.removeStyle(element, 'margin-bottom');
    }
  }

  // Public methods for dynamic responsive changes
  public toggleMobileVisibility(): void {
    this.showOnMobile = !this.showOnMobile;
    this.hideOnMobile = !this.hideOnMobile;
    this.checkScreenSize();
  }

  public updateBreakpoint(newBreakpoint: number): void {
    this.mobileBreakpoint = newBreakpoint;
    this.checkScreenSize();
  }

  public refreshResponsiveness(): void {
    this.checkScreenSize();
  }
}
