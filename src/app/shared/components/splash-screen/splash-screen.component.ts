import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  @Input() options: AnimationOptions = {
    path: '/assets/lottie/5020_promed.json'
  };
  @Output() animationCreated = new EventEmitter();
  @Output() secondaryClick = new EventEmitter();
  @Output() primaryClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onAnimate(animationItem: AnimationItem): void {
    this.animationCreated.emit(animationItem);
  }

}
