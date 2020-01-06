import * as restify from 'restify';

export abstract class Router {
  abstract applyRoutes(application: restify.Server): any;

  render(req: restify.Request, response: restify.Response, next: restify.Next) {
    return (document: any) => {
      if (document) {
        let status;

        switch (req.method) {
          case 'GET':
            status = 200;
            break;
          case 'POST':
            status = 201;
            break;
          case 'DELETE':
            status = 204;
            break;
          case 'PATCH':
            status = 200;
            break;
          case 'PUT':
            status = 200;
            break;
          default:
            status = 200;
            break;
        }

        response.status(status);
        response.json({...document});
      } else {
        response.status(404);
      }

      return next();
    }
  }

  error(req: restify.Request, response: restify.Response, next: restify.Next, message?: String) {
    let status;

    if (req.method === 'GET') {
      status = 404;
    } else {
      status = 400;
    }

    response.status(status);

    if(message && message.trim().length > 0) {
      response.json({ error: message });
    }

    return next();
  }

  serverError(response: restify.Response, next: restify.Next) {
    response.status(500);
    response.json({ error: 'Occurred a internal error' });
    return next();
  }
}
