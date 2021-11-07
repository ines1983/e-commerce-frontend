import { Product } from "../products/Product"
import { Order } from "./Order";

export class OrderItem {
    id: string;
    order: Order;
    product: Product;
    quantity: number; 
    
    constructor (product: Product, order: Order) {
        this.order = order;
        this.product = product;
        this.quantity = 1;
    }
} 