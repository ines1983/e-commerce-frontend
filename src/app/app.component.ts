import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from './orders/Order';
import { OrdersService } from './orders/orders.service';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[];
  public order: Order;
  isLoggedIn = false;
  username: string;

  form = this.fb.group({
    username: [''],
    password: ['']
  });

  constructor(private tokenStorageService: TokenStorageService, private orderService: OrdersService, private fb: FormBuilder, private router : Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getUser();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
     // this.roles = user.roles;
      this.username = user.displayName;
    }  
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.href= '/login';
  }
}
