import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Toy } from '../models/Toy';

@Injectable({
  providedIn: 'root'
})
export class ToyService {

  constructor(private httpClient: HttpClient) { }
  urlToys = 'http://localhost:8081/toys';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getToys(page: number, order: string, search: string, nonStock: Boolean, category: String, brand: String):Observable<any> {
    return this.httpClient.get<any>(`${this.urlToys}?page=${page}&sortBy=${order}&searchTerm=${search}&nonStock=${nonStock}&category=${category}&brand=${brand}`);
  }

  getToyByCode(code: string):Observable<Toy> {
    return this.httpClient.get<Toy>(this.urlToys + '/' + code);
  }

  postToy(toy: any):Observable<any> {
    return this.httpClient.post<any>(this.urlToys + '/new', toy, { headers: this.getHeaders() });
  }

  deleteProduct(code: String):Observable<Boolean> {
    return this.httpClient.put<Boolean>(this.urlToys + '/delete', code, { headers: this.getHeaders() });
  }

  updateProduct(code: String, toy: any):Observable<any> {
    return this.httpClient.put<any>(this.urlToys + '/update/' + code, toy, { headers: this.getHeaders() });
  }
}
