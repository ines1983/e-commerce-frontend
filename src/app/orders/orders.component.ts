import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from './Order';
import { OrderItem } from './OrderItem';
import { OrdersService } from './orders.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {SelectionModel} from '@angular/cdk/collections';
import { Router } from '@angular/router';


@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private orderService : OrdersService, private dialog : MatDialog, private router : Router) { }

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['select', 'name', 'description', 'unitPrice', 'quantity', 'total', 'action'];
  dataSourceOrderItem = new MatTableDataSource<OrderItem>();
  selection = new SelectionModel<OrderItem>(true, []);

  public orderItems: OrderItem[];
  public order: Order;

  public totalPrice : number = 0.0;

  ngAfterViewInit(): void {
    this.dataSourceOrderItem.sort = this.sort;
    this.dataSourceOrderItem.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getOrderItems();
  }

  public doFilter = (value: string) => {
    this.dataSourceOrderItem.filter = value.trim().toLocaleLowerCase();
  }

  public getOrderItems(): void {
    this.orderService.getOrderItems().subscribe(
      (response: OrderItem[]) => {
        this.orderItems = response;
        this.dataSourceOrderItem.data = response as OrderItem[];
        this.dataSourceOrderItem.filterPredicate = (data, filter: string)  => {
          const accumulator = (currentTerm, key) => {
            return key === 'product' ? currentTerm + data.product.description + data.product.name + data.product.unitPrice : currentTerm + data[key];
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          // Transform the filter by converting it to lowercase and removing whitespace.
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };
        this.totalPrice = 0;
        this.orderItems.forEach(o => {this.totalPrice = this.totalPrice + o.quantity * o.product.unitPrice});
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  openRemoveDialog(orderItem: OrderItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var ids = []; 
        ids.push(orderItem.id);
        this.orderService.removeOrderItem(ids).subscribe(() =>{
          this.getOrderItems();
        })
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceOrderItem.data.length;
    return numSelected === numRows;
  }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceOrderItem.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: OrderItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  deleteSelectedProducts() {  
    const numSelected = this.selection.selected;  
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (numSelected.length > 0) {  
            let ids = [];
            numSelected.forEach((orderItem:OrderItem) =>{
              ids.push(orderItem.id);
            })
            this.orderService.removeOrderItem(ids).subscribe(result => {  
              this.getOrderItems(); 
            })  
          } 
      }
    });
  } 

  openProductModule() {
    this.router.navigate(['/products']);
  }

  onOhangeQuantity(orderItem: OrderItem) {
    this.orderService.updateOrderItem(orderItem).subscribe(
      (response) => {
        this.getOrderItems();
      }
    )
  }
} 
