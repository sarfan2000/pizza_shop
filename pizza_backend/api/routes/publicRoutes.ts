import { Express } from 'express';
import { Util } from "../common/util";
import { PublicController } from '../controllers/publicController';

export function initPublicRoutes(app: Express): void {
    app.get('/api/public/test', Util.withErrorHandling(PublicController.test));

}
