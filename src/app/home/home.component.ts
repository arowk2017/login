import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: Http,  private _router: Router) { }

  ngOnInit() {
  }

  logout() {
    
    this.http.get('https://arowk2017-demo-login.herokuapp.com/api/logout').subscribe(
      (res:any)=>{
        this._router.navigate(['/']);
      },
    err => console.log(err)
    
    )  }
}
