import mongoose, { ObjectId } from "mongoose";
import { ObjectIdOr } from "../common/util";
import { ICart } from "./cartModel";


export interface IOrder extends mongoose.Document {
  uid: string;
  carts: ObjectIdOr<ICart>[];
  amount: number;
  discount: number;
  netAmount: number;
  status: string;   // Placed, Shipped, Delivered
  orderDate: Date;
}


