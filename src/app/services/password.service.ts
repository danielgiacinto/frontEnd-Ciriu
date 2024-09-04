import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResetPassword } from '../models/resetPassword';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

constructor(private httpClient : HttpClient) { }

  urlPassword = 'http://localhost:8081/recoverPassword'


  recoverPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.urlPassword + '/sendRecoveryEmail', {email}, {headers});
  }

  changePassword(resetPassword: ResetPassword): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post(this.urlPassword + '/resetPassword', resetPassword, {headers});
  }


}
