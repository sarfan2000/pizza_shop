import mongoose from "mongoose";
import { ObjectIdOr } from "../common/util";

export interface IProduct extends mongoose.Document {
  uid: string;
  product: ObjectIdOr<IProduct>;
}
