import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goBack(): void {
    // Try to go back in browser history, fallback to login page
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

}
