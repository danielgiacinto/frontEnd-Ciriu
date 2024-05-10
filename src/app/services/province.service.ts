import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Province } from '../models/province';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private httpClient: HttpClient) { }
  urlProvinces = 'http://localhost:8081/provinces';

  getProvinces(): Observable<Province[]> {
    return this.httpClient.get<Province[]>(this.urlProvinces);
  }
}
