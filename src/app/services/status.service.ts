import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private httpClient: HttpClient) { }
  urlStatus = 'http://localhost:8081/status';

  getStatus(): Observable<any> {
    return this.httpClient.get<any>(this.urlStatus);
  }
}
