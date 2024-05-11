import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubCategory } from '../models/subCategory';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {


  constructor(private httpClient: HttpClient) { }
  urlSubCategories = 'http://localhost:8081/subCategories';

  getSubCategories():Observable<SubCategory[]> {
    return this.httpClient.get<SubCategory[]>(this.urlSubCategories);
  }

  getSubCategoriesByCategory(category: string):Observable<SubCategory[]> {
    return this.httpClient.get<SubCategory[]>(this.urlSubCategories + '/' + category);
  }

  updateSubCategory(id: number, subCategory: string){
    return this.httpClient.put(this.urlSubCategories + "/edit/" + id, subCategory);
  }

  createSubCategory(subCategory: any){
    return this.httpClient.post(this.urlSubCategories + "/new", subCategory);
  }

}
