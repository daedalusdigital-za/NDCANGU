import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  }

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  addUser(){
    console.log(this.user);

    this.userService.registerUser(this.user).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigateByUrl('/dashboard/users')
      },
      error: (err) => {
        console.log(err);
      }
    })
    
  }

}
