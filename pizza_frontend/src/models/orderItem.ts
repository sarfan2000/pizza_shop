import { CartItem } from "./cartItem";

export interface OrderItem {
    uid: string;
    carts: CartItem[];
    amount: number;
    discount: number;
    netAmount: number;
    status: string;   // Placed, Shipped, Delivered
    orderDate: Date;
}