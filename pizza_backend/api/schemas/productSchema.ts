import mongoose, { Schema } from "mongoose";
import { IProduct } from "../models/productModel";

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  netPrice: {
    type: Number,
    required: true,
  },
  crust: {
    type: String,
    required: true,
  },
  sauce: {
    type: String,
    required: true,
  },
  cheese: {
    type: String,
    required: true,
  },
  toppings: {
    type: [String],
    required: false,
    default: [],
  },
  isTrending: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Product = mongoose.model<IProduct>("product", productSchema);

export default Product;
