import { NotFoundError } from 'restify-errors';
import * as restify from 'restify';
import { ModelRouter } from '../../common/model-router';
import { Restaurant } from '../models/restaurant.model';

class RestaurantsRouter extends ModelRouter<Restaurant> {

  constructor() {
    super(Restaurant);
  }

  applyRoutes(application: restify.Server) {
    application.get('/restaurants', this.findAll);

    application.get('/restaurants/:id', [this.validateId, this.findById]);

    application.post('/restaurants', this.save);

    application.put('/restaurants/:id', [this.validateId, this.replace]);

    application.patch('/restaurants/:id', [this.validateId, this.update]);

    application.del('/restaurants/:id', [this.validateId, this.delete]);

    application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);

    application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu])
  }

  findMenu = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      const { id } = req.params;
      Restaurant.findById(id, "+menu")
        .then((rest) => {
          if (!rest) throw new NotFoundError('Restaurant not found');
          res.json(rest.menu);
          return next();
        })
        .catch(next);
    } catch (err) {
      this.serverError;
    }
  }

  replaceMenu = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      const { id } = req.params;
      Restaurant.findById(id)
        .then((rest) => {
          if (!rest) {
            throw new NotFoundError('Restaurant not found');
          } else {
            rest.menu = req.body;
            return rest.save();
          }
        })
        .then((rest) => {
          res.json(rest.menu);
          return next();
        })
        .catch(next);
    } catch (err) {
      this.serverError;
    }
  }

}

export const restaurantsRouter = new RestaurantsRouter();
