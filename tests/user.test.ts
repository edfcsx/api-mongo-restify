import 'jest'
import supertest from 'supertest'
import { Server } from './../src/loaders/server';
import { userRouter } from './../src/api/routes/users.route';
import env from '../environment';
import { User } from './../src/api/models/user.model';

let server: Server

describe('API testes', () => {
  beforeAll(() => {
    env.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test',
    env.app.port = process.env.PORT || 3001,

    server = new Server()
    return server.bootstrap([userRouter])
      .then(() => User.deleteMany({}))
      .catch(console.error)
  })

  afterAll(() => {
    server.shutdown();
  });

  it('GET /users', () => {
    return supertest('http://localhost:3001')
      .get('/users')
      .then((response: any) => {
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
      })
      .catch(fail)
  })

  it('POST /users', () => {
    const send = {
      name: 'usuario de teste',
      email: 'usuariodeteste@teste.com',
      password: 'teste',
      cpf: '18605558024'
    };

    return supertest('http://localhost:3001')
      .post('/users')
      .send(send)
      .then((response: any) => {
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe(send.name)
        expect(response.body.email).toBe(send.email)
        expect(response.body.cpf).toBe(send.cpf)
        expect(response.body.password).toBeUndefined()
      })
      .catch(fail);
  });
});
