const express = require('express');
const kalamata = require('kalamata');
const {
  knex
, Project
, Entity
, Related
} = require('./model');

const PORT = Number(process.env.PORT || 4000);
const app = express();
const api = kalamata(app);

/* support serializing Error objects */
app.set('json replacer', (k, v) => (v instanceof Error) ? v.message : v);

/* in development mode, simulate a little latency */
app.use((req, res, next) => setTimeout(next, 250));

/* maybe not the smartest CORS headers given that we have no authentication... */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.get('/comparands/:project_id', (req, res, next) =>
  /* TODO this probably only works in sqlite3 */
  knex('entity')
  .select()
  .where({ project: req.params.project_id })
  .orderBy(knex.raw('random()'))
  .limit(3)
  .then($ => res.send($))
  .catch(next)
)

api.expose(Project);
api.expose(Entity);
api.expose(Related);

app.use((err, req, res, next) =>
  res.status(500).send(err)
)

app.listen(PORT);
