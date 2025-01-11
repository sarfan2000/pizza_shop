import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).firebaseUser = decodedToken; // Use a unique property name
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
