import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-phone-number',
  templateUrl: './verify-phone-number.component.html'
})
export class VerifyPhoneNumberComponent implements OnInit {

    // set the currenr year
    year: number = new Date().getFullYear();
    // Carousel navigation arrow show
    showNavigationArrows: any;

    /**
     * Phone verification component
     */
    constructor() { }

    ngOnInit(): void {
    }

}
