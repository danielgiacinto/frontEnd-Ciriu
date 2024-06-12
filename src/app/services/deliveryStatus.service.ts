import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryStatusService {

  constructor(private httpClient: HttpClient) { }
  urlDeliveryStatus = 'http://localhost:8081/delivery';

  getDeliveryStatus(): Observable<any> {
    return this.httpClient.get<any>(this.urlDeliveryStatus);
  }
}
