import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private loginService: LoginService) { }
  urlUsers = environment.urlUsers;
  checkout: boolean = false;

  private roleSubject = new BehaviorSubject<string | null>(this.decodeRoleFromToken());
  role$ = this.roleSubject.asObservable();

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

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

  getOrdersByIdUser(page:number, id: string): Observable<any> {
    return this.httpClient.get<any>(this.urlUsers + '/orders/' + id + '?page=' + page, {headers: this.getHeaders()});
  }

  setRole(role: string) {
    this.roleSubject.next(role);
  }

  private decodeRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.rol;
      } catch (error) {
        console.error('Error decodificando el token JWT:', error);
        return null;
      }
    }
    return null;
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

}
