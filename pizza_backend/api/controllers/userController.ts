import { Request, Response } from "express";
import Product from "../schemas/productSchema";
import { Util } from "../common/util";

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
}
