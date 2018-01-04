const express = require('express');
const kalamata = require('kalamata');
const {
  knex
, Project
, Entity
, Related
} = require('./model');

const PORT = Number(process.env.PORT || 3000);
const app = express();
const api = kalamata(app);

api.expose(Project);
api.expose(Entity);
api.expose(Related);

app.listen(PORT);
