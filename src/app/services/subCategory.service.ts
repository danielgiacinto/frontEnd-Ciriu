import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubCategory } from '../models/subCategory';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {


  constructor(private httpClient: HttpClient) { }
  urlSubCategories = environment.urlSubCategories;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getSubCategories():Observable<SubCategory[]> {
    return this.httpClient.get<SubCategory[]>(this.urlSubCategories);
  }

  getSubCategoriesByCategory(category: string):Observable<SubCategory[]> {
    return this.httpClient.get<SubCategory[]>(this.urlSubCategories + '/' + category);
  }

  updateSubCategory(id: number, subCategory: string){
    return this.httpClient.put(this.urlSubCategories + "/edit/" + id, subCategory, { headers: this.getHeaders() });
  }

  createSubCategory(subCategory: any){
    return this.httpClient.post(this.urlSubCategories + "/new", subCategory, { headers: this.getHeaders() });
  }

}
