const request = require('supertest');
const app = require('../../src/app');

test('Deve criar usuário via signup', () => {
  return request(app).post('/auth/signup')
    .send({ name: 'João Camargo', email: `${Date.now()}@email.com`, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('João Camargo');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
    });
});


test('Deve receber token ao logar', () => {
  const email = `${Date.now()}@email.com`;
  return app.services.user.save(
    { name: 'João Camargo', email, password: '123456' },
  )
    .then(() => request(app).post('/auth/signin')
      .send({ email, password: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Não deve autenticar usuario com senha errada', () => {
  const email = `${Date.now()}@email.com`;
  return app.services.user.save(
    { name: 'João Camargo', email, password: '123456' },
  )
    .then(() => request(app).post('/auth/signin')
      .send({ email, password: '123444' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuario ou Senha incorreta');
    });
});

test('Não deve autenticar usuario que não existe', () => {
  return request(app).post('/auth/signin')
    .send({ email: 'naoexiste@email.com', password: '123444' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuario ou Senha incorreta');
    });
});

test('Não deve acessar uma rota protegida sem token', () => {
  return request(app).get('/v1/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
