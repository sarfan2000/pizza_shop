import mongoose, { Schema } from "mongoose";
import { IOrder } from "../models/orderModel";

const orderSchema = new Schema<IOrder>(
  {
    uid: { type: String, required: true },
    carts: [{ type: Schema.Types.ObjectId, ref: "cart" }],
    amount: { type: Number, required: true },
    discount: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: { type: String, required: true, default: "Placed" },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);



const Order = mongoose.model<IOrder>("order", orderSchema);
export default Order;
