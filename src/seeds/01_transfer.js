
exports.seed = (knex) => {
  return knex('transactions').del()
    .then(() => knex('transfers').del())
    .then(() => knex('accounts').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      {
        id: 10000, name: 'User #1', email: 'user1@email.com', password: '$2a$10$11nL3Rv18b56fSzLGcaaIeHMUG1sDaWBPKZBFBNZp1oqGl2lPuVfu',
      },
      {
        id: 20000, name: 'User #2', email: 'user2@email.com', password: '$2a$10$11nL3Rv18b56fSzLGcaaIeHMUG1sDaWBPKZBFBNZp1oqGl2lPuVfu',
      },
    ]))
    .then(() => knex('accounts').insert([
      { id: 10000, name: 'AccO #1', user_id: 10000 },
      { id: 10001, name: 'AccD #1', user_id: 10000 },
      { id: 20000, name: 'AccO #2', user_id: 20000 },
      { id: 20001, name: 'AccD #2', user_id: 20000 },
    ]))
    .then(() => knex('transfers').insert([
      {
        id: 10000, description: 'Transfer #1', user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, ammount: 100, date: new Date(),
      },
      {
        id: 20000, description: 'Transfer #2', user_id: 20000, acc_ori_id: 20000, acc_dest_id: 20001, ammount: 100, date: new Date(),
      },
    ]))
    .then(() => knex('transactions').insert([
      {
        description: 'Transfer from AccO #1 to AccD #1', date: new Date(), ammount: 100, type: 'I', acc_id: '10001', transfer_id: 10000,
      },
      {
        description: 'Transfer to AccD #1 from AccO #1', date: new Date(), ammount: -100, type: 'O', acc_id: '10000', transfer_id: 10000,
      },
      {
        description: 'Transfer from AccO #2 to AccD #2', date: new Date(), ammount: 100, type: 'I', acc_id: '20001', transfer_id: 20000,
      },
      {
        description: 'Transfer to AccD #2 from AccO #2', date: new Date(), ammount: -100, type: 'O', acc_id: '20000', transfer_id: 20000,
      },
    ]));
};
