import { Express } from "express";
import { UserController } from "../controllers/userController";
import { Util } from "../common/util";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

export function initUserRoutes(app: Express): void {
  app.get("/api/protected", verifyFirebaseToken, UserController.protectedTest);
  app.get(
    "/api/auth/get-all-products",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.getAllProducts)
  );

 

  app.post(
    "/api/auth/orders/create",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.createOrder)
  );

  app.get(
    "/api/auth/get-orders",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.getOrdersByUser)
  );

  // app.post(
  //   "/api/feedback/submit",
  //   verifyFirebaseToken,
  //   Util.withErrorHandling(UserController.submitFeedback)
  // );

  app.get(
    "/api/auth/get-favorites",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.getFavorites)
  );

  // Add a pizza to favorites
  app.post(
    "/api/auth/add-favorite/:productId",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.addFavorite)
  );

  // Remove a pizza from favorites
  app.delete(
    "/api/auth/remove-favorite/:productId",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.removeFavorite)
  );

  // cart related
  app.get(
    "/api/auth/get-cart-items",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.getCartItems)
  );

  // Add a pizza to cart
  app.post(
    "/api/auth/add-cart/:productId",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.addCartItem)
  );

  // update quantity of a pizza in cart
  app.put(
    "/api/auth/update-cart-item/:productId",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.updateCartItem)
  );

  // Remove a pizza from cart
  app.delete(
    "/api/auth/remove-cart/:productId",
    verifyFirebaseToken,
    Util.withErrorHandling(UserController.removeCartItem)
  );
}
