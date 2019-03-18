import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'hammerjs';
import {
  MatCardModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatToolbarModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatDialogModule,
  MatInputModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatExpansionModule
} from '@angular/material';
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings
} from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { NewsService } from './services/news.service';
import { ProcessHttpErrorService } from './services/process-http-error.service';
import { AuthInterceptorService, UnauthInterceptorService } from './services/interceptor.service';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SlideCardComponent } from './components/slide-card/slide-card.component';
import { CategoryComponent } from './components/category/category.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    SlideCardComponent,
    CategoryComponent,
    ErrorMessageComponent,
    PasswordResetComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  providers: [
    NewsService,
    ProcessHttpErrorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthInterceptorService,
      multi: true
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LdRbY8UAAAAAJAZcuyD1CiqFG1m_05adBM1js8G'
      } as RecaptchaSettings
    }
  ],
  entryComponents: [
    LoginComponent,
    SignupComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faGithub);
  }
}
