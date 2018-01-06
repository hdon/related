const knex = require('./db');
const bookshelf = require('bookshelf')(knex);
const Project = bookshelf.Model.extend({
  tableName: 'project'
})
const Entity = bookshelf.Model.extend({
  tableName: 'entity'
})
const Related = bookshelf.Model.extend({
  tableName: 'related'
})
module.exports = {
  knex
, Project
, Entity
, Related
}
