import e, { Request, Response } from "express";
import Product from "../schemas/productSchema";
import Cart from "../schemas/cartSchema";
import Order from "../schemas/orderSchema";
import Favorite from "../schemas/favoriteSchema";
import { Util } from "../common/util";
import mongoose from "mongoose";

export namespace UserController {
  export async function protectedTest(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;
      Util.sendSuccess(res, currentUser);
    } catch (error) {
      throw Error(error);
    }
  }
  export async function getAllProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const data = await Product.find();
      Util.sendSuccess(res, data);
    } catch (error) {
      throw Error(error);
    }
  }

  export async function createOrder(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { cartItems, totalAmount } = req.body;
      const currentUser = (req as any).firebaseUser;

      const cart = cartItems.map((item: any) => item._id);

      const newOrder = new Order({
        uid: currentUser.uid,
        carts: cart,
        amount: totalAmount,
        discount: 0,
        netAmount: totalAmount,
        status: "Placed",
      });

      const savedOrder = await newOrder.save();
      await Cart.deleteMany({ uid: currentUser.uid });
      Util.sendSuccess(res, savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      Util.sendError(res, "Internal server error", 500);
    }
  }

  export async function getOrdersByUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;

      const data = await Order.find({ uid: currentUser.uid })
        .populate("carts")
        .populate("carts.product");
      Util.sendSuccess(res, data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Util.sendError(res, "Internal server error", 500);
    }
  }

  // export async function submitFeedback(
  //   req: Request,
  //   res: Response
  // ): Promise<void> {
  //   try {
  //     const { orderId, pizzaId, pizzaName, userEmail, message } = req.body;

  //     if (!orderId || !pizzaId || !userEmail || !message) {
  //       return Util.sendError(res, "Missing required fields", 400);
  //     }

  //     console.log(
  //       `Feedback submitted: Order ID: ${orderId}, Pizza ID: ${pizzaId}, User Email: ${userEmail}, Message: ${message}`
  //     );

  //     Util.sendSuccess(res, { message: "Feedback submitted successfully!" });
  //   } catch (error) {
  //     console.error("Error submitting feedback:", error);
  //     Util.sendError(res, "Internal server error", 500);
  //   }
  // }

  //Favorite
  export async function getFavorites(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;
      const data = await Favorite.find({ uid: currentUser.uid }).populate(
        "product"
      );
      Util.sendSuccess(res, data);
    } catch (error) {
      console.error("Error fetching favorite items:", error);
      Util.sendError(res, "Failed to fetch favorite items.", 500);
    }
  }

  // Add a pizza to favorites
  export async function addFavorite(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;

      const { productId } = req.params;
      const existingFavorite = await Favorite.findOne({
        product: productId,
        uid: currentUser.uid,
      });

      if (existingFavorite) {
        Util.sendError(res, "Pizza is already in favorites.", 400);
        return;
      }

      const newFavorite = new Favorite({
        product: productId,
        uid: currentUser.uid,
      });

      await newFavorite.save();
      Util.sendSuccess(res, newFavorite, "Pizza added to favorites.");
    } catch (error) {
      console.error("Error adding favorite:", error);
      Util.sendError(res, "Failed to add pizza to favorites.", 500);
    }
  }

  // Remove a pizza from favorites
  export async function removeFavorite(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;

      const { productId } = req.params;
      const result = await Favorite.findOneAndDelete({
        product: new mongoose.Types.ObjectId(productId),
        uid: currentUser.uid,
      });

      if (!result) {
        Util.sendError(res, "Pizza not found in favorites.", 404);
        return;
      }

      Util.sendSuccess(res, result, "Pizza removed from favorites.");
    } catch (error) {
      console.error("Error removing favorite:", error);
      Util.sendError(res, "Failed to remove pizza from favorites.", 500);
    }
  }

  // cart realated
  export async function getCartItems(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;
      const data = await Cart.find({ uid: currentUser.uid }).populate(
        "product"
      );
      Util.sendSuccess(res, data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      Util.sendError(res, "Failed to fetch cart items.", 500);
    }
  }

  // Add a pizza to cart
  export async function addCartItem(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;

      const { productId } = req.params;
      const product = await Product.findById(productId);
      const existingCartItem = await Cart.findOne({
        product: productId,
        uid: currentUser.uid,
      });

      if (existingCartItem) {
        Util.sendError(res, "Pizza is already in cart.", 400);
        return;
      }

      const newCartItem = new Cart({
        product: productId,
        uid: currentUser.uid,
        quantity: 1,
        totalAmount: product.price,
      });

      await newCartItem.save();
      Util.sendSuccess(res, newCartItem, "Pizza added to cart.");
    } catch (error) {
      console.error("Error adding cart:", error);
      Util.sendError(res, "Failed to add pizza to cart.", 500);
    }
  }

  export async function updateCartItem(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;

      const { productId } = req.params;
      const { quantity } = req.body;
      const product = await Product.findById(productId);
      const existingCartItem = await Cart.findOne({
        product: productId,
        uid: currentUser.uid,
      });
      existingCartItem.quantity = quantity;
      existingCartItem.totalAmount = product.price * quantity;

      await existingCartItem.save();
      Util.sendSuccess(res, existingCartItem, "Pizza added to cart.");
    } catch (error) {
      console.error("Error adding cart:", error);
      Util.sendError(res, "Failed to add pizza to cart.", 500);
    }
  }

  // Remove a pizza from cart
  export async function removeCartItem(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const currentUser = (req as any).firebaseUser;

      const { productId } = req.params;
      const result = await Cart.findOneAndDelete({
        product: new mongoose.Types.ObjectId(productId),
        uid: currentUser.uid,
      });

      if (!result) {
        Util.sendError(res, "Pizza not found in cart.", 404);
        return;
      }

      Util.sendSuccess(res, result, "Pizza removed from cart.");
    } catch (error) {
      console.error("Error removing cart:", error);
      Util.sendError(res, "Failed to remove pizza from cart.", 500);
    }
  }
}
