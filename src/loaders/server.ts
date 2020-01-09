import mongoose from 'mongoose';
import * as restify from 'restify';
import env from '../../environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './../common/merged-patch.parser';
import { handleError } from './../common/error.handler';

export class Server {
  public application!: restify.Server;

  private initializeServer(routes: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: env.app.name,
          version: env.package.version,
        });

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);

        for (const router of routes) {
          router.applyRoutes(this.application);
        }

        this.application.listen(env.app.port, () => resolve(this.application));

        this.application.on('restifyError', (handleError));
      } catch (error) {
        reject(error);
      }
    });
  }

  private initializeDatabase(): Promise<any> {
    (<any>mongoose).Promise = global.Promise

    return mongoose.connect(env.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDatabase()
      .then(() => this.initializeServer(routers).then(() => this));
  }

  shutdown(): Promise<Server> {
    return mongoose.disconnect().then(() => this.application.close())
  }
}
