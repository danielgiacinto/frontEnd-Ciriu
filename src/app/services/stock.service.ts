import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private httpClient: HttpClient) { }
  urlStocks = 'http://localhost:8081/stock';

  getMovements(page:number, fromDate: String, toDate: String, movement: String): Observable<any> {
    return this.httpClient.get<any>(`${this.urlStocks}/all?page=${page}&fromDate=${fromDate}&toDate=${toDate}&movement=${movement}`);
  }

  createMovement(movement: any): Observable<any> {
    return this.httpClient.post<any>(this.urlStocks + '/newMovement', movement);
  }
}
