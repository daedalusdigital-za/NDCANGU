import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/services/base/base.service';

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
    user: any = {
      mobileNo: ''
    }

  constructor(private baseService: BaseService,  private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
    console.log(history.state.mobileNo);

    if(history.state.mobileNo) {
      this.user.mobileNo = history.state.mobileNo
    } else {
      this.router.navigateByUrl('/auth/login')
    }
  }


  /**
   * Confirm phone verification
   */
  verifyUser(){
    // Simplified phone verification
    this.router.navigateByUrl('/auth/login')
  }
}
