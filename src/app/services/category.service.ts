import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private httpClient: HttpClient) { }
  urlCategories = 'http://localhost:8081/categories';

  getCategories():Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.urlCategories);
  }

  createCategory(category: any){
    return this.httpClient.post(this.urlCategories + "/new", category);
  }

  updateCategory(id: number, category: String){
    return this.httpClient.put(this.urlCategories + "/edit/" + id, category);
  }
}
