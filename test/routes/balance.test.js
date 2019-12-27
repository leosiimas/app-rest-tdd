const request = require('supertest');
const moment = require('moment');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/balance';
const ROUTE_TRANSACTION = '/v1/transactions';
const ROUTE_TRANSFER = '/v1/transfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAwMDAsIm5hbWUiOiJVc2VyICMzIiwiZW1haWwiOiJ1c2VyM0BlbWFpbC5jb20ifQ.wzfN6dLMVeyIXCRAOVcvfNm0iSl5emcxWbfnz7BqoXA';
const TOKEN_GERAL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTAwMDAsIm5hbWUiOiJVc2VyICM1IiwiZW1haWwiOiJ1c2VyNUBlbWFpbC5jb20ifQ.RIOfojqoXlSAEsW2AfWCfcpIQABJ99uMv3JKYK7pSXw';

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
});

describe('Ao calcular o saldo do usuário...', () => {
  test('Deve retornar apenas as contas com alguma trasação', () => {
    return request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
      });
  });

  test('Deve adicionar valores de entrada', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: '1', date: new Date(), ammount: 100, type: 'I', acc_id: 30000, status: true,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('100.00');
          });
      });
  });

  test('Deve subtrair valores de saida', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: '1', date: new Date(), ammount: 200, type: 'O', acc_id: 30000, status: true,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('-100.00');
          });
      });
  });

  test('Não deve considerar trasações pendentes', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: '1', date: new Date(), ammount: 200, type: 'O', acc_id: 30000, status: false,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('-100.00');
          });
      });
  });

  test('Não deve misturar saldo de contas distintas', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: '1', date: new Date(), ammount: 50, type: 'I', acc_id: 30001, status: true,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('-100.00');
            expect(res.body[1].id).toBe(30001);
            expect(res.body[1].sum).toBe('50.00');
          });
      });
  });

  test('Não deve considerar contas de outros usuarios', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: '1', date: new Date(), ammount: 50, type: 'I', acc_id: 40000, status: true,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('-100.00');
            expect(res.body[1].id).toBe(30001);
            expect(res.body[1].sum).toBe('50.00');
          });
      });
  });

  test('Deve considerar uma transação passada', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: '1', date: moment().subtract({ days: 5 }), ammount: 250, type: 'I', acc_id: 30000, status: true,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('150.00');
            expect(res.body[1].id).toBe(30001);
            expect(res.body[1].sum).toBe('50.00');
          });
      });
  });

  test('Não deve considerar uma transação futura', () => {
    return request(app).post(ROUTE_TRANSACTION)
      .send({
        description: '1', date: moment().add({ days: 5 }), ammount: 250, type: 'I', acc_id: 30000, status: true,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('150.00');
            expect(res.body[1].id).toBe(30001);
            expect(res.body[1].sum).toBe('50.00');
          });
      });
  });

  test('Deve considerar transferencia', () => {
    return request(app).post(ROUTE_TRANSFER)
      .send({
        description: '1', date: new Date(), ammount: 250, acc_ori_id: 30000, acc_dest_id: 30001,
      })
      .set('authorization', `bearer ${TOKEN}`)
      .then(() => {
        return request(app).get(MAIN_ROUTE)
          .set('authorization', `bearer ${TOKEN}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].id).toBe(30000);
            expect(res.body[0].sum).toBe('-100.00');
            expect(res.body[1].id).toBe(30001);
            expect(res.body[1].sum).toBe('300.00');
          });
      });
  });
});

test('Deve calcular saldo das contas do usuário', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN_GERAL}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(50000);
      expect(res.body[0].sum).toBe('162.00');
      expect(res.body[1].id).toBe(50001);
      expect(res.body[1].sum).toBe('-248.00');
    });
});
