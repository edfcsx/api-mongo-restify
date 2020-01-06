import * as restify from 'restify';

export const handleError = (req: restify.Request, res: restify.Response, err: any, done: any) => {
  err.toJSON = () => {
    return {
      error: err.message,
    }
  }

  switch(err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        err.statusCode = 400;
      }
      break;
    case 'ValidationError':
      err.statusCode = 400;

      const messages: any[] = [];

      for (const name in err.errors) {
        messages.push({ error: err.errors[name].message });
      }

      err.toJSON = () => {
        return {
          errors: messages,
        }
      }

      break;
  }



  done();
}
