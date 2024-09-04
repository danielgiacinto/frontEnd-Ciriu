import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private httpClient: HttpClient) { }
  urlBrand = 'http://localhost:8081/brands';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getBrands():Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(this.urlBrand);
  }

  createBrand(brand: any){
    return this.httpClient.post(this.urlBrand + "/new", brand, { headers: this.getHeaders() });
  }

  updateBrand(id: number, brand: String){
    return this.httpClient.put(this.urlBrand + "/edit/" + id, brand, { headers: this.getHeaders() });
  }

}
