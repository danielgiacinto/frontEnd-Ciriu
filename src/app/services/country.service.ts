import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private httpClient: HttpClient) { }
  urlCounties = 'http://localhost:8081/countries';

  getCountries():Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.urlCounties);
  }
}
