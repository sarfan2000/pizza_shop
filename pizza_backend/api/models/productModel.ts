import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
    name: string;
    description: string;
    images: string[];
    price: number;
    discount: number;
    netPrice: number;
    crust: string;
    sauce: string;
    cheese: string;
    toppings: string[];
    isTrending: boolean;
}