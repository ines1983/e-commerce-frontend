import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from './Product';
import { ProductsService } from './products.service';
import { OrdersService } from '../orders/orders.service';
import { OrderItem } from '../orders/OrderItem';
import { Order } from '../orders/Order';


@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private productService : ProductsService, private orderService: OrdersService) { }

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['select', 'name', 'description', 'unitPrice', 'action'];
  dataSourceProduct = new MatTableDataSource<Product>();
  selection = new SelectionModel<Product>(true, []);

  public products: Product[];
  public product: Product;
  public order: Order;

  ngAfterViewInit(): void {
    this.dataSourceProduct.sort = this.sort;
    this.dataSourceProduct.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getProductItems();
  }

  public doFilter = (value: string) => {
    this.productService.retriveProductsByNameOrDesc(value).subscribe(
      (response: Product[]) => {
        this.products = response;
        this.dataSourceProduct.data = response as Product[];
      }
    )
    //this.dataSourceProduct.filter = value.trim().toLocaleLowerCase();
  }

  public getProductItems(): void {
    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.products = response;
        this.dataSourceProduct.data = response as Product[];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  addToOrderDialog(product: Product) {
    let order: Order;
    this.orderService.getOrderItems().subscribe(
      (response: OrderItem[]) => {
        if(response.length > 0) {
          order = response[0].order;
        }
        this.orderService.addToOrder(product, order).subscribe(
          (response) => {
          }
        );
    });
    
  }

  deleteSelectedProducts() {  
    const numSelected = this.selection.selected;  

    if (numSelected.length > 0) {  
        numSelected.forEach((product:Product) =>{
          this.addToOrderDialog(product)
        });
      } 
  } 

  public addProductsToOrderDialog() {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceProduct.data.length;
    return numSelected === numRows;
  }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceProduct.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
