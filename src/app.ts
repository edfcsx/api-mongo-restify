import { Server } from './loaders/server';
import { utilsRouter } from './api/routes/utils';
import { userRouter } from './api/routes/users';

const server = new Server();

server.bootstrap(
  [
    utilsRouter,
    userRouter,
  ]
)
  .then((server) => {
    const { address, port } = server.application.address();
    console.log(`Server listener on address: ${address} in port: ${port}`)
  })
  .catch((err) => {
    console.log('Server failed to start');
    console.error(err);
    process.exit(1);
  });