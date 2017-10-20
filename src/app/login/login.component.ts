import { Component, OnInit } from '@angular/core';
import { Login } from '../login.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Headers, RequestOptions, RequestOptionsArgs, Http, Response, Request, RequestMethod} from '@angular/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  rForm: FormGroup;
  username:string = '';
  password:string = '';
  model = new Login('','');

  constructor(private fb: FormBuilder, public http: Http, private _router: Router) { 
    this.rForm = fb.group({
        'username' : [null, Validators.required],
        'password' : [null, Validators.required],
    });
  }

  ngOnInit() {
  }

  submitContact(value: any){
    // Once the form is submitted and we get the users email and password we’ll format our request based on the Auth0 API.
    let form = {
      'username' : value.username,
      'password' : value.password,  
    }
     
    this.http.post('', form).subscribe(
      (res:any)=>{
        
        let data = res.json();
        
        this._router.navigate(['/home']);
        
      }
    );
  }
}
