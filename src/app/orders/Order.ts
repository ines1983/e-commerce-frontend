import { OrderItem } from "./OrderItem";

export class Order {
    id: string;
    code: number;
    totalPrice: number;
    orderItems: OrderItem[]
}