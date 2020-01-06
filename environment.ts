import * as fs from 'fs';
import * as path from 'path';

export default {
  app: {
    name: 'restify-meat-api',
    port: process.env.PORT || 3000,
  },
  db: {
    url: process.env.DB_URL || 'mongodb://localhost/meat-api',
  },
  package: {
    ...JSON.parse(fs.readFileSync(path.resolve('./package.json'), { encoding: 'utf8' })),
  },
  security: {
    saltRounds: 10,
  }
};
