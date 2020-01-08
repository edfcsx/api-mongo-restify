import * as restify from 'restify';
import env from '../../../environment';
import { Router } from '../../common/router';

class UtilsRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get('/ping', (req, res, next) => {
      res.status(200);
      res.json({
        name: env.app.name,
        version: env.package.version,
      });
      return next();
    });
  }
}

export const utilsRouter = new UtilsRouter();
