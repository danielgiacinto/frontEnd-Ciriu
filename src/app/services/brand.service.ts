import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private httpClient: HttpClient) { }
  urlBrand = environment.urlBrand;
  private brandUpdatedSource = new BehaviorSubject<void>(undefined);
  brandUpdated$ = this.brandUpdatedSource.asObservable();

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

  notifyBrandUpdated() {
    this.brandUpdatedSource.next(); // Emitir evento
  }

}
