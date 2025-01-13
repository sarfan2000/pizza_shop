import { Pizza } from "./pizza";


export interface CartItem {
  _id: string;
  uid: string;
  product: Pizza;
  quantity: number;
  totalAmount: number;
}