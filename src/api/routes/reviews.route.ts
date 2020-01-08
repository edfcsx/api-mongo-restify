import * as restify from 'restify';
import mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';
import { ModelRouter } from '../../common/model-router';
import { Review } from './../models/review.model';

class ReviewsRouter extends ModelRouter<Review> {

  constructor() {
    super(Review);
  }

  protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
    return query.populate('user', 'name')
      .populate('restaurant', 'name');
  }

  // findById = (req: restify.Request, res: restify.Response, next: restify.Next) => {
  //   try {
  //     const { id } = req.params;

  //     this.model.findOne({ _id: id })
  //       .populate('user', 'name')
  //       .populate('restaurant', 'name')
  //       .then((result) => {
  //         if (result) {
  //           res.json(result);
  //         } else {
  //           throw new NotFoundError('Register not Found');
  //         }
  //         return next();
  //       })
  //       .catch(next);
  //   } catch (err) {
  //     this.serverError(res, next);
  //   }
  // }

  applyRoutes(application: restify.Server) {
    application.get('/reviews', this.findAll);
    application.get('/reviews/:id', [this.validateId, this.findById]);
    application.post('/reviews', this.save);
  }

}

export const reviewsRouter = new ReviewsRouter();
