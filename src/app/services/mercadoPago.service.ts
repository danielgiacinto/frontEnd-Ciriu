import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  urlMercadoPago = environment.urlMercadoPago;
  
  constructor(private httpClient: HttpClient) { }
  payMercadoPago(products: any): Observable<any> {
    const IdempotencyKey = generateUuid();
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'X-Idempotency-Key': IdempotencyKey});
    return this.httpClient.post<any>(this.urlMercadoPago, products, {headers});
  }
}


function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

