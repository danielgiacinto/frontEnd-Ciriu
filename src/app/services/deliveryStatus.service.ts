import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryStatusService {

  constructor(private httpClient: HttpClient) { }
  urlDeliveryStatus = environment.urlDeliveryStatus;

  getDeliveryStatus(): Observable<any> {
    return this.httpClient.get<any>(this.urlDeliveryStatus);
  }
}
