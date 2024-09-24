import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }
  urlOrder = environment.urlOrder;

  private getHeaders(): HttpHeaders {
    // Recupera el token del almacenamiento local (o donde lo estés guardando)
    const token = localStorage.getItem('token'); // Ajusta según donde guardes el token
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Incluye el token en los encabezados
      'Content-Type': 'application/json' // Asegúrate de que el tipo de contenido sea JSON
    });
  }

  createOrder(order: Order): Observable<any> {
    return this.httpClient.post(this.urlOrder + '/new', order, { headers: this.getHeaders() });
  }

  updateOrder(id:string, id_status: number, id_delivery_status: number): Observable<any> {
    return this.httpClient.put(`${this.urlOrder}/update/${id}/${id_status}/${id_delivery_status}`, {}, { headers: this.getHeaders() });
  }

  getAllOrders(page:number, fromDate : String, toDate: String, status: number): Observable<any> {
    return this.httpClient.get(`${this.urlOrder}?page=${page}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`, { headers: this.getHeaders() });
  }

  consultReport(fromDate: String, toDate: String): Observable<any> {
    return this.httpClient.get(`${this.urlOrder}/report?fromDate=${fromDate}&toDate=${toDate}`, { headers: this.getHeaders() });
  }

  consultReportMonth(year: number) {
    return this.httpClient.get(`${this.urlOrder}/report/month/${year}`, { headers: this.getHeaders() });
  }

  getGift(id:string): Observable<any> {
    return this.httpClient.get(`${this.urlOrder}/gift/${id}`, { headers: this.getHeaders() });
  }

  
}
