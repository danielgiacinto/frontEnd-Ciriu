import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }
  urlUsers = 'http://localhost:8081/users';
  urlOrder = 'http://localhost:8081/orders';
  checkout: boolean = false;

  getInfo():Observable<User> {
    const id = localStorage.getItem('user') || '';
    console.log(id);
    return this.httpClient.get<User>(this.urlUsers + '/' + id);
  }

  updateInfo(user: User):Observable<User> {
    const id = localStorage.getItem('user') || '';
    return new Observable<User>(observer => {
      this.httpClient.put<User>(`${this.urlUsers}/update/${id}`, user).subscribe(
        (response) => {
          this.checkout = true;
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  updateSuccess():Observable<boolean> {
    return of(this.checkout);
  }

  getOrdersByIdUser(id: string): Observable<any> {
    return this.httpClient.get<any>(this.urlOrder + '/user/' + id);
  }

}
