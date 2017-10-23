import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  token:any;
  location: Location;
  constructor(private http: Http,  private _router: Router,  private loginService: LoginService, location: Location) {
    this.location = location;
   }

  ngOnInit() {
    this.token = this.loginService.currentUser();
  }

  logout() {
    this.loginService.logout();
    this.location.replaceState('/');
    this._router.navigate(['/']);
      }
}
