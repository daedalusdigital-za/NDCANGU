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
   * Confirm Otp Verification
   */
config = {
  allowNumbersOnly: true,
  length: 4,
  isPasswordInput: false,
  disableAutoFocus: false,
  placeholder: '',
  inputStyles: {
    'width': '80px',
    'height': '50px'
  }
};

user: any = {
  mobileNo: '',
  code: ''
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


  verifyUser(){

    this.baseService.basePost(`Auth/VeifyRegistration?mobileNo=${this.user.mobileNo}&code=${this.user.code}`, {}).subscribe({
      next: (response)=>{        
        if(!response){
          this.user.code = '';
          this.toastrService.error("Invalid OTP, please try again");
          return;
        } 
        this.router.navigateByUrl('/auth/login')
      }
    })

  }
}
