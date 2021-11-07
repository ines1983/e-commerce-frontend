import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../common/app.constants';
import { Product } from '../products/Product';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http : HttpClient) { }

  private apiServerUrl = AppConstants.API_URL;

  public getAllOrders() : Observable<Order[]> {
    return this.http.get<Order[]> (this.apiServerUrl + 'orders/all');  
  }

  public getOrderItems() : Observable<OrderItem[]> {
    return this.http.get<OrderItem[]> (this.apiServerUrl + 'orders/find/order-items');  
  }

  public removeOrderItem(ids: string[]): Observable<any>{
    let params = new HttpParams();
    ids.forEach((id:string) =>{
      params = params.append('orderItemsId', id);
    })
    return this.http.delete<void>(this.apiServerUrl + 'orders/delete-order-items', {params});
  }

  public addToOrder(product: Product, order: Order): Observable<void> {
      const orderItem = new OrderItem(product, order);
      return this.http.post<void>(this.apiServerUrl + 'orders/add-products-to-order', orderItem);
   }
 
   public updateOrderItem(orderItem: OrderItem): Observable<void> {
     return this.http.put<void> (this.apiServerUrl + 'orders/update-order-item', orderItem);
   }

}
