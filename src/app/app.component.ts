import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LoaderService } from './services/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ncd-poc-ng';
  isLogin: boolean = false;

  loading: boolean = true;

  constructor(private router: Router, private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((v: any) => {
      this.loading = v;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url && event.url.includes('login')) {
          this.isLogin = true;
        }
      }
    }
    );
  }
}
