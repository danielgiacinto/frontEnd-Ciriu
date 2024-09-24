import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Province } from '../models/province';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private httpClient: HttpClient) { }
  urlProvinces = environment.urlProvinces;

  getProvinces(): Observable<Province[]> {
    return this.httpClient.get<Province[]>(this.urlProvinces);
  }
}
