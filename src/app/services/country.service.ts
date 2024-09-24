import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private httpClient: HttpClient) { }
  urlCounties = environment.urlCounties;

  getCountries():Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.urlCounties);
  }
}
