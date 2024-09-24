import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private httpClient: HttpClient) { }
  urlStatus = environment.urlStatus;

  getStatus(): Observable<any> {
    return this.httpClient.get<any>(this.urlStatus);
  }
}
