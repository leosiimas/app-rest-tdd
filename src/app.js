const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');


// TODO criar chaveamento dinamico
app.db = knex(knexfile.test);


/* eslint-disable */
consign({
  cwd: 'src', verbose: false,
})
  .include('./config/passport.js')
  .include('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);
/* eslint-enable */

app.get('/', (req, res) => {
  res.status(200).send();
});

/* app.use((req, res) => {
  res.status(404).send('Pagina não existe');
}); */

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'ValidationError') res.status(400).json({ error: message });
  else if (name === 'RecursoIndevidoError') res.status(403).json({ error: message });
  // eslint-disable-next-line no-undef
  else {
    res.status(500).json({ name, message, stack });
  }
  next(err);
});

app.db.on('query', () => {
}).on('query-response', () => {
}).on('error', (error) => console.log(error));

module.exports = app;
