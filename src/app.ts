import { Server } from './loaders/server';
import { utilsRouter } from './api/routes/utils.route';
import { userRouter } from './api/routes/users.route';
import { reviewsRouter } from './api/routes/reviews.route';
import { restaurantsRouter } from './api/routes/restaurants.route';

const server = new Server();

server.bootstrap(
  [
    utilsRouter,
    userRouter,
    restaurantsRouter,
    reviewsRouter,
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
