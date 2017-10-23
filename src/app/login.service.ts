import { Injectable } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import * as JWT from 'jwt-decode';

@Injectable()
export class LoginService {

  constructor(protected storage: AsyncLocalStorage) { }

  saveToken(token) {
    
        localStorage.setItem('user_token', JSON.stringify(token));
  }

  logout() {
        localStorage.removeItem('user_token');
  }

  getToken() {
    var token;
    return token = localStorage.getItem('user_token');
    
  }

  currentUser() {
    if(this.isLoggedIn()){
      var payload = JWT(this.getToken());
      return payload;
    }
  }

  isLoggedIn() {
    var token = this.getToken();
    var payload;

  if(token){
    payload = JWT(token);
    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
  }

  parseJwt(token){
    var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
  }
}
