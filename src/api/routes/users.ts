import * as restify from 'restify';
import * as _ from 'lodash';
import { Router } from '../../common/router';
import { User } from './../models/user.model';
import { NotFoundError, BadRequestError } from 'restify-errors';

class UserRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get('/users',async (req, res, next) => {
      try {
        User.find()
          .then((result: any) => res.json(result))
          .catch(next)
      } catch (err) {
        this.serverError(res, next);
      }
    });

    application.get('/users/:id', async (req, res, next) => {
      try {
        const { id } = req.params;

        User.findOne({ _id: id })
          .then((result) => {
            if (result) {
              res.json(result);
            } else {
              throw new NotFoundError('User not found');
            }
            return next();
          })
          .catch(next);
      } catch (err) {
        this.serverError(res, next);
      }
    });

    application.post('/users', async (req, res, next) => {
      try {
        let user = new User({ ...req.body });

        user.save()
          .then((user) => {
            user.password = undefined;
            res.json({ user });
            return next();
          })
          .catch(next);
      } catch (err) {
        this.serverError(res, next);
      }
    });

    application.put('/users/:id', async (req, res, next) => {
      try {
        const { id } = req.params;

        const options = {
          runValidators: true,
        };

        User.updateOne({ _id: id }, { ...req.body }, options)
          .then(async (result) => {
            if (result.n > 0) {
              const user = await User.findOne({ _id: id });
              res.json(user);
            } else {
              throw new BadRequestError('Occurred a error to update user');
            }
          })
          .catch(next)
      } catch (err) {
        this.serverError(res, next);
      }
    });

    application.patch('/users/:id', async (req, res, next) => {
      try {
        const { id } = req.params;

        const options = {
          runValidators: true,
        };

        User.updateOne({ _id: id }, { ...req.body }, options)
          .then(async (result) => {
            if (result.n > 0) {
              const user = await User.findOne({ _id: id });
              res.json(user);
            } else {
              throw new BadRequestError('Occurred a error to update user');
            }
          })
          .catch(next);
      } catch (err) {
        this.serverError(res, next);
      }
    });

    application.del('/users/:id', async (req, res, next) => {
      try {
        const { id } = req.params;

        User.deleteOne({ _id: id })
          .then((result) => {
            if (result.n === 1) {
              res.status(200);
              res.json({ });
              return next();
            } else {
              throw new NotFoundError('User not found');
            }
          })
          .catch(next);
      } catch (err) {
        this.serverError(res, next);
      }
    });

  }
}

export const userRouter = new UserRouter();
