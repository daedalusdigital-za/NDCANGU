import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LottieModule } from 'ngx-lottie';

// Core module (singleton services, guards, interceptors)
import { CoreModule } from './core/core.module';

// Shared components
import { SplashScreenComponent } from './shared/components/splash-screen/splash-screen.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';


export function playerFactory(): any {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    SplashScreenComponent,
    NotFoundComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    LottieModule.forRoot({ player: playerFactory }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
