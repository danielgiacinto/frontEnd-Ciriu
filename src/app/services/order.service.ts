import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }
  urlOrder = 'http://localhost:8081/orders'

  createOrder(order: Order): Observable<any> {
    return this.httpClient.post(this.urlOrder + '/new', order);
  }

  updateOrder(id:string, id_status: number, id_delivery_status: number): Observable<any> {
    return this.httpClient.put(`${this.urlOrder}/update/${id}/${id_status}/${id_delivery_status}`, null);
  }

  getAllOrders(page:number, fromDate : String, toDate: String, status: number): Observable<any> {
    return this.httpClient.get(`${this.urlOrder}?page=${page}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`);
  }

  consultReport(fromDate: String, toDate: String): Observable<any> {
    return this.httpClient.get(`${this.urlOrder}/report?fromDate=${fromDate}&toDate=${toDate}`);
  }

  consultReportMonth(year: number) {
    return this.httpClient.get(`${this.urlOrder}/report/month/${year}`);
  }

  
}
