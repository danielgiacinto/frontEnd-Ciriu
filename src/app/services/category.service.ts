import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private httpClient: HttpClient) { }
  urlCategories = environment.urlCategories;
  private categoryUpdatedSource = new BehaviorSubject<void>(undefined);
  categoryUpdated$ = this.categoryUpdatedSource.asObservable();

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCategories():Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.urlCategories);
  }

  createCategory(category: any){
    return this.httpClient.post(this.urlCategories + "/new", category, { headers: this.getHeaders() });
  }

  updateCategory(id: number, category: String){
    return this.httpClient.put(this.urlCategories + "/edit/" + id, category, { headers: this.getHeaders() });
  }

  notifyCategoryUpdated() {
    this.categoryUpdatedSource.next();
  }
}
