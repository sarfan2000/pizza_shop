import { Request, Response } from "express";
import { Util } from "../common/util";
import Product from "../schemas/productSchema";

export namespace PublicController {
  const pizzas = [
    {
      name: "Margherita",
      description: "Classic pizza with fresh mozzarella and tomato sauce.",
      images: ["margherita1.jpg", "margherita2.jpg"],
      price: 9.99,
      discount: 10,
      netPrice: 8.99,
      isTrending: true,
      crust: "Thin",
      sauce: "Tomato",
      cheese: "Mozzarella",
      toppings: ["Basil", "Olives"],
    },
    {
      name: "Pepperoni",
      description: "Spicy pepperoni slices with mozzarella and marinara sauce.",
      images: ["pepperoni1.jpg", "pepperoni2.jpg"],
      price: 12.99,
      discount: 5,
      netPrice: 11.99,
      isTrending: false,
      crust: "Thick",
      sauce: "Tomato",
      cheese: "Mozzarella",
      toppings: ["Pepperoni", "Oregano"],
    },
    {
      name: "Vegetarian",
      description:
        "Loaded with veggies like bell peppers, olives, and mushrooms.",
      images: ["vegetarian1.jpg", "vegetarian2.jpg"],
      price: 11.49,
      discount: 15,
      netPrice: 9.99,
      isTrending: false,
      crust: "Stuffed",
      sauce: "Pesto",
      cheese: "Cheddar",
      toppings: ["Bell Peppers", "Olives", "Mushrooms"],
    },
    {
      name: "BBQ Chicken",
      description: "Grilled chicken with BBQ sauce and mozzarella.",
      images: ["bbq-chicken1.jpg", "bbq-chicken2.jpg"],
      price: 13.99,
      discount: 0,
      netPrice: 13.99,
      isTrending: true,
      crust: "Thin",
      sauce: "BBQ",
      cheese: "Cheddar",
      toppings: ["Grilled Chicken", "Red Onion"],
    },
    {
      name: "Hawaiian",
      description: "Ham, pineapple, and cheese on a crispy crust.",
      images: ["hawaiian1.jpg", "hawaiian2.jpg"],
      price: 10.99,
      discount: 20,
      netPrice: 8.79,
      isTrending: false,
      crust: "Classic",
      sauce: "Tomato",
      cheese: "Mozzarella",
      toppings: ["Ham", "Pineapple"],
    },
    {
      name: "Four Cheese",
      description: "A cheese lover’s dream with a blend of four cheeses.",
      images: ["four-cheese1.jpg", "four-cheese2.jpg"],
      price: 14.99,
      discount: 5,
      netPrice: 14.24,
      isTrending: true,
      crust: "Thin",
      sauce: "Alfredo",
      cheese: "Mozzarella, Cheddar, Parmesan, Gouda",
      toppings: ["Cheese"],
    },
    {
      name: "Meat Lovers",
      description: "Packed with sausage, bacon, pepperoni, and ground beef.",
      images: ["meat-lovers1.jpg", "meat-lovers2.jpg"],
      price: 16.49,
      discount: 10,
      netPrice: 14.84,
      isTrending: false,
      crust: "Stuffed",
      sauce: "Tomato",
      cheese: "Mozzarella",
      toppings: ["Sausage", "Bacon", "Pepperoni", "Ground Beef"],
    },
    {
      name: "Buffalo Chicken",
      description: "Spicy buffalo chicken with mozzarella and blue cheese.",
      images: ["buffalo-chicken1.jpg", "buffalo-chicken2.jpg"],
      price: 12.99,
      discount: 15,
      netPrice: 11.04,
      isTrending: false,
      crust: "Thin",
      sauce: "Buffalo",
      cheese: "Mozzarella",
      toppings: ["Buffalo Chicken", "Blue Cheese"],
    },
    {
      name: "Cheeseburger",
      description:
        "A pizza inspired by a cheeseburger with beef patty, onions, and pickles.",
      images: ["cheeseburger1.jpg", "cheeseburger2.jpg"],
      price: 13.49,
      discount: 5,
      netPrice: 12.82,
      isTrending: true,
      crust: "Classic",
      sauce: "Ketchup",
      cheese: "Cheddar",
      toppings: ["Beef Patty", "Onions", "Pickles"],
    },
    {
      name: "Seafood Supreme",
      description:
        "A delightful blend of shrimp, mussels, and clams with mozzarella.",
      images: ["seafood-supreme1.jpg", "seafood-supreme2.jpg"],
      price: 18.99,
      discount: 10,
      netPrice: 17.09,
      isTrending: false,
      crust: "Stuffed",
      sauce: "Tomato",
      cheese: "Mozzarella",
      toppings: ["Shrimp", "Mussels", "Clams"],
    },
  ];

  export async function test(req: Request, res: Response): Promise<void> {
    try {
       await Product.insertMany(pizzas);
      Util.sendSuccess(res, "test passed successfully");
    } catch (error) {
      Util.sendError(res, error);
    }
  }
}
