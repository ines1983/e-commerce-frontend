import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../common/app.constants';
import { Product } from './Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiServerUrl = AppConstants.API_URL;

  constructor(private http : HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiServerUrl}products/all`);
  } 

  public retriveProductsByNameOrDesc(searchTerm: string): Observable<Product[]> {
    const params = new HttpParams();
    params.set('searchTerm', searchTerm);
    return this.http.get<Product[]>(this.apiServerUrl + 'products/search-by-name-desc?searchTerm=' +searchTerm);
  }

  public getProduct(id : string): Observable<Product> {
    return this.http.get<Product>(`${this.apiServerUrl}products/find/` + id);
   }
}
