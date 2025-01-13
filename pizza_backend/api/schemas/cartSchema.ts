import mongoose, { Schema } from "mongoose";
import { ICart } from "../models/cartModel";

const cartSchema: Schema = new Schema<ICart>(
  {
    uid: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("cart", cartSchema);
export default Cart;
