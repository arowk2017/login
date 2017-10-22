import { Component, OnInit } from '@angular/core';
import { Login } from '../login.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Headers, RequestOptions, RequestOptionsArgs, Http, Response, Request, RequestMethod} from '@angular/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { LoginService } from '../login.service';


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
  error_message:string = '';

  constructor(private fb: FormBuilder, public http: Http, private _router: Router,  private loginService: LoginService) { 
    this.rForm = fb.group({
        'username' : [null, Validators.required],
        'password' : [null, Validators.required],
    });
  }

  ngOnInit() {
  }

  submitLogin(value: any){
    // Once the form is submitted and we get the users email and password we’ll format our request based on the Auth0 API.
    let form = {
      'username' : value.username,
      'password' : value.password,  
    };
     
    //let headers = new Headers();
    //headers.append('Content-Type', 'application/json');
    //let options = new RequestOptions({ headers: headers, withCredentials: true });

    //this.http.post('https://cors-anywhere.herokuapp.com/https://arowk2017-demo-login.herokuapp.com/api/login', form, options).subscribe(
          this.http.post('https://cors-anywhere.herokuapp.com/https://arowk2017-demo-login.herokuapp.com/api/login', form).subscribe(

      (res:any)=>{
        
        if (res.status === 200) {
                        let data = res.json();
                          //console.log(data);
                          this.loginService.saveToken(data.token);
                          this._router.navigate(['/home']);
                    }
      },
   
    err => {
      if (err.status === 401) {
                    this.error_message = "Username/Password is invalid";
                    return Observable.throw(new Error(err.status));
                }
    }
    )
    
    
    /*
    map((res: Response) => {
                console.log(res.status);
      
      if (res) {
                     if (res.status === 200) {
                        let data = res.json();
                          console.log(data);
                          this._router.navigate(['/home']);
                    }
                }
            }).catch((error: any) => {
                if (error.status === 401) {
                    this.error_message = "Username/Password is invalid";
                    return Observable.throw(new Error(error.status));
                }
            });
    */
    
  
    
  }

  submitRegister(value: any){
    // Once the form is submitted and we get the users email and password we’ll format our request based on the Auth0 API.
    let form = {
      'username' : value.username,
      'password' : value.password,  
    };
     
    this.http.post('https://arowk2017-demo-login.herokuapp.com/api/users', form).subscribe(
      (res:any)=>{
        
        let data = res.json();
        console.log(data);
        this.loginService.saveToken(data.token);
        this._router.navigate(['/home']);
        
      }
    );
  }
}
