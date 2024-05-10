import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private httpClient: HttpClient) { }
  urlBrand = 'http://localhost:8081/brands';

  getBrands():Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(this.urlBrand);
  }
}
