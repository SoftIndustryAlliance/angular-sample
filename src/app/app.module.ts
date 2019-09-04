import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ReportComponent } from './components/report/report.component';
import { SellersSelectComponent } from './components/sellers-select/sellers-select.component';
import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationFormComponent } from './components/authentication-form/authentication-form.component';
import { AppRoutingModule } from './app-routing.module';

import { httpInterceptorProviders } from './interceptors/index';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReportComponent,
    SellersSelectComponent,
    ContentComponent,
    LoginComponent,
    AuthenticationFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AppRoutingModule,

  ],
  exports: [
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,

  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
