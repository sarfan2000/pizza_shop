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
}
