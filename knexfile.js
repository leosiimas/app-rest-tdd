module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '123456',
      database: 'api_rest',
    },
    migrations: { directory: 'src/migrations' },
    seeds: { directory: 'src/seeds' },
  },
};
