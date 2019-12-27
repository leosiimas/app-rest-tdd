
const moment = require('moment');

exports.seed = (knex) => {
  return knex('users')
    .insert([
      {
        id: 30000, name: 'User #3', email: 'user3@email.com', password: '$2a$10$11nL3Rv18b56fSzLGcaaIeHMUG1sDaWBPKZBFBNZp1oqGl2lPuVfu',
      },
      {
        id: 40000, name: 'User #4', email: 'user4@email.com', password: '$2a$10$11nL3Rv18b56fSzLGcaaIeHMUG1sDaWBPKZBFBNZp1oqGl2lPuVfu',
      },
      {
        id: 50000, name: 'User #5', email: 'user5@email.com', password: '$2a$10$11nL3Rv18b56fSzLGcaaIeHMUG1sDaWBPKZBFBNZp1oqGl2lPuVfu',
      },
    ])
    .then(() => knex('accounts').insert([
      { id: 30000, name: 'Saldo Principal', user_id: 30000 },
      { id: 30001, name: 'Saldo Secundario', user_id: 30000 },
      { id: 40000, name: 'Conta Alternativa 1', user_id: 40000 },
      { id: 40001, name: 'Conta Alternativa  2', user_id: 40000 },
      { id: 50000, name: 'Acc Geral Principal', user_id: 50000 },
      { id: 50001, name: 'Acc Geral Secundario', user_id: 50000 },
    ]))
    .then(() => knex('transfers').insert([
      {
        id: 50000, description: 'Transfer #1', user_id: 50000, acc_ori_id: 50000, acc_dest_id: 50001, ammount: 256, date: new Date(),
      },
      {
        id: 40000, description: 'Transfer #2', user_id: 40000, acc_ori_id: 40000, acc_dest_id: 40001, ammount: 512, date: new Date(),
      },
    ]))
    .then(() => knex('transactions').insert([
      // Transação Positiva ammount = 2
      {
        description: '2', date: new Date(), ammount: 2, type: 'I', acc_id: '50000', status: true,
      },
      // Transação Usuario Errado ammount = 2
      {
        description: '2', date: new Date(), ammount: 4, type: 'I', acc_id: '40000', status: true,
      },
      // Transação Outra Conta ammount = 2
      {
        description: '2', date: new Date(), ammount: 8, type: 'I', acc_id: '50001', status: true,
      },
      // Transação Pendente ammount = 2
      {
        description: '2', date: new Date(), ammount: 16, type: 'I', acc_id: '50000', status: false,
      },
      // Transação Passada ammount = 34
      {
        description: '2', date: moment().subtract({ days: 5 }), ammount: 32, type: 'I', acc_id: '50000', status: true,
      },
      // Transação Futura ammount = 34
      {
        description: '2', date: moment().add({ days: 5 }), ammount: 64, type: 'I', acc_id: '50000', status: true,
      },
      // Transação Negativa ammount = -94
      {
        description: '2', date: moment(), ammount: -128, type: 'O', acc_id: '50000', status: true,
      },
      // Trasnf Negativa ammount = 162
      {
        description: '2', date: moment(), ammount: 256, type: 'I', acc_id: '50000', status: true,
      },
      {
        description: '2', date: moment(), ammount: -256, type: 'O', acc_id: '50001', status: true,
      },
      // Trasnf Negativa ammount = 162
      {
        description: '2', date: moment(), ammount: 512, type: 'I', acc_id: ' 40001', status: true,
      },
      {
        description: '2', date: moment(), ammount: -512, type: 'O', acc_id: ' 40000', status: true,
      },
    ]));
};
