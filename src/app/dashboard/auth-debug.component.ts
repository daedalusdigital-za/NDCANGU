import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global/global.service';
import { User } from '../shared/interfaces/common.interfaces';

@Component({
  selector: 'app-auth-debug',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5>Authentication Debug</h5>
            </div>
            <div class="card-body">
              <div class="alert alert-info">
                <h6>Current User:</h6>
                <pre>{{ currentUser | json }}</pre>
              </div>
              <div class="alert alert-warning" *ngIf="!currentUser">
                <p>No user found in localStorage</p>
              </div>
              <div class="alert alert-success" *ngIf="currentUser && currentUser.token">
                <p>User is authenticated with token: {{ currentUser.token.substring(0, 20) }}...</p>
              </div>
              <div class="alert alert-danger" *ngIf="currentUser && !currentUser.token">
                <p>User found but no token available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthDebugComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private globalService: GlobalService) {}

  ngOnInit() {
    this.currentUser = this.globalService.getLocalStorage<User>('currentUser');
    console.log('Current user from localStorage:', this.currentUser);
  }
}
