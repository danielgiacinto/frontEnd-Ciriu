import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private httpClient: HttpClient) { }
  urlStocks = environment.urlStocks;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMovements(page:number, fromDate: String, toDate: String, movement: String): Observable<any> {
    return this.httpClient.get<any>(`${this.urlStocks}/all?page=${page}&fromDate=${fromDate}&toDate=${toDate}&movement=${movement}`, { headers: this.getHeaders() });
  }

  createMovement(movement: any): Observable<any> {
    return this.httpClient.post<any>(this.urlStocks + '/newMovement', movement, { headers: this.getHeaders() });
  }
}
