import mongoose, { ObjectId } from "mongoose";
import { ObjectIdOr } from "../common/util";

export interface IProduct extends mongoose.Document {
    name: string;
    description: string;
    images: string[];
    address: string;
    price: number;
    discount: number;
    netPrice: number;
    isTrending: boolean;
}