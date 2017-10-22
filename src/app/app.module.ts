import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatTabsModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ROUTES } from './app.routes';
import { LoginService } from './login.service';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    ROUTES,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    AsyncLocalStorageModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
