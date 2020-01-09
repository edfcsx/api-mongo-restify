import { Router } from './router';
import * as restify from 'restify';
import mongoose from 'mongoose';
import { NotFoundError, BadRequestError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  constructor(protected model: mongoose.Model<D>) {
    super();
  }

  protected prepareOne(query: mongoose.DocumentQuery<D | null, D>): mongoose.DocumentQuery<D | null, D> {
    return query;
  }

  validateId = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError('Document not found'));
    } else {
      next();
    }
  }

  findAll = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      this.model.find()
        .then((result: any) => res.json(result))
        .catch(next)
    } catch (err) {
      this.serverError(res, next);
    }
  }

  findById = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      const { id } = req.params;

      this.prepareOne(this.model.findOne({ _id: id }))
        .then((result) => {
          if (result) {
            res.json(result);
          } else {
            throw new NotFoundError('Register not Found');
          }
          return next();
        })
        .catch(next);
    } catch (err) {
      this.serverError(res, next);
    }
  }

  save = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      let document = new this.model({ ...req.body });

      document.save()
        .then(async (document) => {
          res.json(await this.model.findById(document._id));
          return next();
        })
        .catch(next);
    } catch (err) {
      this.serverError(res, next);
    }
  }

  replace = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      const { id } = req.params;

      const options = {
        runValidators: true,
      };

      this.model.updateOne({ _id: id }, { ...req.body }, options)
        .then(async (result) => {
          if (result.n > 0) {
            const document = await this.model.findOne({ _id: id });
            res.json(document);
          } else {
            throw new BadRequestError('Occurred a error to update document');
          }
        })
        .catch(next)
    } catch (err) {
      this.serverError(res, next);
    }
  }

  update = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      const { id } = req.params;

      const options = {
        runValidators: true,
      };

      this.model.updateOne({ _id: id }, { ...req.body }, options)
        .then(async (result) => {
          if (result.n > 0) {
            const document = await this.model.findOne({ _id: id });
            res.json(document);
          } else {
            throw new BadRequestError('Occurred a error to update document');
          }
        })
        .catch(next);
    } catch (err) {
      this.serverError(res, next);
    }
  }

  delete = (req: restify.Request, res: restify.Response, next: restify.Next) => {
    try {
      const { id } = req.params;

      this.model.deleteOne({ _id: id })
        .then((result) => {
          if (result.n === 1) {
            res.status(200);
            res.json({ });
            return next();
          } else {
            throw new NotFoundError('Document not found');
          }
        })
        .catch(next);
    } catch (err) {
      this.serverError(res, next);
    }
  }

}
