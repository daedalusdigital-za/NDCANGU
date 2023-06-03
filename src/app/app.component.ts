import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from './services/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ncd-poc-ng';
  isLogin: boolean = true;

  loading: boolean = true;

  constructor(private loaderService: LoaderService, private router: ActivatedRoute) {
    this.loaderService.isLoading.subscribe((v: any) => {
      setTimeout(() => {
        this.loading = v;
      },2000)
    });

    const urlSegments = this.router.snapshot.url;
    console.log('URL Segments:', urlSegments);

    // Apply conditions or logic based on the specific route
    if (urlSegments.length > 0 && urlSegments[0].path !== 'auth') {
      this.isLogin = false;
    } else {
      // Do something else for other routes
      this.isLogin = true;
    }
  }
}
