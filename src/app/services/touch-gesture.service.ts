import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface TouchGesture {
  type: 'swipe' | 'tap' | 'pinch' | 'longpress';
  direction?: 'left' | 'right' | 'up' | 'down';
  element: HTMLElement;
  originalEvent: TouchEvent;
  distance?: number;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TouchGestureService {
  private gestureSubject = new Subject<TouchGesture>();
  public gesture$ = this.gestureSubject.asObservable();

  private touchStartTime: number = 0;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchStartDistance: number = 0;
  private longPressTimeout: any;

  // Configuration
  private readonly SWIPE_THRESHOLD = 50;
  private readonly LONG_PRESS_DURATION = 500;
  private readonly TAP_DURATION = 200;
  private readonly PINCH_THRESHOLD = 10;

  constructor(private ngZone: NgZone) {}

  /**
   * Initialize touch gestures for an element
   */
  initTouchGestures(element: HTMLElement): void {
    // Remove existing listeners to prevent duplicates
    this.removeTouchGestures(element);

    // Add touch event listeners
    element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
  }

  /**
   * Remove touch gesture listeners from an element
   */
  removeTouchGestures(element: HTMLElement): void {
    element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }

  private handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    const target = event.currentTarget as HTMLElement;

    this.touchStartTime = Date.now();
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

    // Handle multi-touch for pinch gestures
    if (event.touches.length === 2) {
      this.touchStartDistance = this.getDistance(event.touches[0], event.touches[1]);
    }

    // Set up long press detection
    this.longPressTimeout = setTimeout(() => {
      this.emitGesture({
        type: 'longpress',
        element: target,
        originalEvent: event,
        duration: Date.now() - this.touchStartTime
      });
    }, this.LONG_PRESS_DURATION);

    // Add active state for touch feedback
    target.classList.add('touch-active');
  }

  private handleTouchMove(event: TouchEvent): void {
    // Clear long press if user moves finger
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    // Handle pinch gestures
    if (event.touches.length === 2) {
      const currentDistance = this.getDistance(event.touches[0], event.touches[1]);
      const distanceDiff = Math.abs(currentDistance - this.touchStartDistance);

      if (distanceDiff > this.PINCH_THRESHOLD) {
        this.emitGesture({
          type: 'pinch',
          element: event.currentTarget as HTMLElement,
          originalEvent: event,
          distance: currentDistance - this.touchStartDistance
        });
      }
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    const target = event.currentTarget as HTMLElement;
    const touchEndTime = Date.now();
    const duration = touchEndTime - this.touchStartTime;

    // Clear long press timeout
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    // Remove active state
    target.classList.remove('touch-active');

    // Handle single touch gestures
    if (event.changedTouches.length === 1) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Determine gesture type
      if (distance < 10 && duration < this.TAP_DURATION) {
        // Tap gesture
        this.emitGesture({
          type: 'tap',
          element: target,
          originalEvent: event,
          duration: duration
        });
      } else if (distance > this.SWIPE_THRESHOLD) {
        // Swipe gesture
        const direction = this.getSwipeDirection(deltaX, deltaY);
        this.emitGesture({
          type: 'swipe',
          direction: direction,
          element: target,
          originalEvent: event,
          distance: distance,
          duration: duration
        });
      }
    }

    // Provide haptic feedback
    this.triggerHapticFeedback();
  }

  private handleTouchCancel(event: TouchEvent): void {
    const target = event.currentTarget as HTMLElement;
    
    // Clear timeouts and states
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
    
    target.classList.remove('touch-active');
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getSwipeDirection(deltaX: number, deltaY: number): 'left' | 'right' | 'up' | 'down' {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  private emitGesture(gesture: TouchGesture): void {
    this.ngZone.run(() => {
      this.gestureSubject.next(gesture);
    });
  }

  private triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(25);
          break;
        case 'medium':
          navigator.vibrate(50);
          break;
        case 'heavy':
          navigator.vibrate([50, 30, 50]);
          break;
      }
    }
  }

  /**
   * Create a touch-optimized click handler
   */
  createTouchClickHandler(callback: () => void): (event: Event) => void {
    let touchStarted = false;

    return (event: Event) => {
      if (event.type === 'touchstart') {
        touchStarted = true;
        // Prevent mouse events
        event.preventDefault();
      } else if (event.type === 'touchend') {
        if (touchStarted) {
          touchStarted = false;
          callback();
          event.preventDefault();
        }
      } else if (event.type === 'click' && !touchStarted) {
        // Handle mouse click for desktop
        callback();
      }
    };
  }

  /**
   * Utility method to make any element touch-friendly
   */
  makeTouchFriendly(element: HTMLElement, options?: {
    minHeight?: number;
    minWidth?: number;
    padding?: number;
  }): void {
    const defaultOptions = {
      minHeight: 44,
      minWidth: 44,
      padding: 8
    };
    
    const config = { ...defaultOptions, ...options };
    
    // Apply touch-friendly styles
    element.style.minHeight = `${config.minHeight}px`;
    element.style.minWidth = `${config.minWidth}px`;
    element.style.padding = `${config.padding}px`;
    element.style.cursor = 'pointer';
    element.style.userSelect = 'none';
    (element.style as any).webkitUserSelect = 'none';
    (element.style as any).webkitTouchCallout = 'none';
    (element.style as any).webkitTapHighlightColor = 'transparent';
    
    // Add touch class for CSS styling
    element.classList.add('touch-friendly');
    
    // Initialize gesture handling
    this.initTouchGestures(element);
  }

  /**
   * Create a swipe-to-dismiss handler
   */
  createSwipeToDismiss(element: HTMLElement, onDismiss: () => void): void {
    this.initTouchGestures(element);
    
    const subscription = this.gesture$.subscribe(gesture => {
      if (gesture.element === element && 
          gesture.type === 'swipe' && 
          (gesture.direction === 'left' || gesture.direction === 'right')) {
        onDismiss();
      }
    });

    // Store subscription for cleanup
    (element as any).swipeSubscription = subscription;
  }

  /**
   * Clean up swipe-to-dismiss
   */
  removeSwipeToDismiss(element: HTMLElement): void {
    if ((element as any).swipeSubscription) {
      (element as any).swipeSubscription.unsubscribe();
      delete (element as any).swipeSubscription;
    }
    this.removeTouchGestures(element);
  }
}
