import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlLogin = environment.urlLogin;
  constructor(private httpClient: HttpClient) { }

  loginUser(login: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.urlLogin, login, {headers});
  }

  createAccount(account: any): Observable<any> {
    return this.httpClient.post(this.urlLogin + '/signUp', account);
  }

  verifyAccount(code: any): Observable<any> {
    return this.httpClient.post(this.urlLogin + '/verify', code);
  }


}
