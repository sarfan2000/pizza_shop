import { Request, Response } from "express";
import { Util } from "../common/util";

export namespace PublicController {

  export async function test(req: Request, res: Response): Promise<void> {
    try {
      console.log('object')
      Util.sendSuccess(res, "test passed successfully");
    } catch (error) {
      Util.sendError(res, error);
    }

  };

}


