const express = require('express');
const kalamata = require('kalamata');
const Promise = require('bluebird');
const debug = require('debug')('app');
const {
  knex
, Project
, Entity
, Related
} = require('./model');

const PORT = Number(process.env.PORT || 4000);
const app = express();
app.use(require('body-parser').json());
const api = kalamata(app);

/* support serializing Error objects */
app.set('json replacer', (k, v) => (v instanceof Error) ? v.message : v);

/* in development mode, simulate a little latency */
//app.use((req, res, next) => setTimeout(next, 250));

/* maybe not the smartest CORS headers given that we have no authentication... */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  /* NOTE assuming OPTIONS is only ever a CORS preflight request... */
  if (req.method == 'OPTIONS')
    res.end();
  else
    next();
})

app.get('/comparands/:project_id', (req, res, next) =>
  /* TODO this probably only works in sqlite3 */
  knex('entity')
  .select()
  .where({ project: req.params.project_id })
  .orderBy(knex.raw('random()'))
  .limit(3)
  .then($ => {
    if ($.length != 3)
      throw new Error('project does not exist or has fewer than three entities');
    res.send($)
  })
  .catch(next)
)

app.get('/related/:project_id', (req, res, next) => {
  let entities;
  /* we'll use two queries to keep things simple i guess... */
  return knex('entity')
  .select()
  .where({ project: req.params.project_id })
  .then($ => {
    entities = $;
    const entityIds = entities.map(e => e.id);
    return knex('related')
    .select()
    .whereIn('a', entityIds)
    .orWhereIn('b', entityIds)
  }).then(relateds =>
    res.send({ relateds, entities })
  ).catch(next)
})

/* TODO knex doesn't support ON DUPLICATE KEY UPDATE, and I'm not even sure
 * it supports something like UPDATE t SET a=a+1. So we can either do yet
 * another raw query here or we can just do two queries -- I'm gonna do two
 * queries for now because I'm lazy.
 *
 * TODO Add a transaction. Horay for minor race conditions!
 */
app.post('/related', (req, res, next) => Promise.try(() => {
  debug(req.body);
  debug(Object.keys(req.body));
  debug(Object.keys(req.body).length);
  if (Object.keys(req.body).length != 2)
    throw new Error('invalid number of parameters');
  if ('number' !== typeof req.body.a)
    throw new Error('invalid "a" parameter');
  if ('number' !== typeof req.body.b)
    throw new Error('invalid "b" parameter');
  let a, b;
  if (req.body.a < req.body.b) {
    a = req.body.a;
    b = req.body.b;
  } else {
    b = req.body.a;
    a = req.body.b;
  }
  knex('related')
  .select()
  .where(req.body)
  .first()
  .then($ => $
  ? knex('related')
    .update({ n: $.n+1 })
    .where({ a, b })
  : knex('related')
    .insert({ a , b , n: 1 })
  ).then(() =>
    res.end()
  )
}).catch(next))

api.expose(Project);
api.expose(Entity);

app.use((err, req, res, next) => {
  debug('final error handler');
  debug(err);
  res.status(500).send(err)
})

app.listen(PORT);
