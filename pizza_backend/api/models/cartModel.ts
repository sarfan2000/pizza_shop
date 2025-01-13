import mongoose from "mongoose";
import { ObjectIdOr } from "../common/util";
import { IProduct } from "./productModel";

export interface ICart extends mongoose.Document {
  uid: string;
  product: ObjectIdOr<IProduct>;
  quantity: number;
  totalAmount: number;
}
