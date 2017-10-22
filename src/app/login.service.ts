import { Injectable } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Injectable()
export class LoginService {

  constructor(protected storage: AsyncLocalStorage) { }

  saveToken(token) {
        this.storage.setItem('user_token', token).subscribe(() => {});
  }

  logout() {
        this.storage.removeItem('user_token').subscribe(() => {}, () => {});
  }

  getToken() {
    var token;
        this.storage.getItem('user_token').subscribe((data) => {
           token = data;
        });
        return token;
  }

  currentUser() {
        if(this.isLoggedIn()){
    var token = this.getToken();
    var payload = token.split('.')[1];
    payload = atob(payload);
    payload = JSON.parse(payload);
    
    return {
      username : payload.username
    };
  }
  }

  isLoggedIn() {
        var token = this.getToken();
  var payload;

  if(token){
    payload = token.split('.')[1];
    payload = atob(payload);
    payload = JSON.parse(payload);

    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
  }
}
