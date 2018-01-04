const knex = require('./db');
const bookshelf = require('bookshelf')(knex);
const Project = bookshelf.Model.extend({
  tableName: 'project'
})
module.exports = {
  knex
, Project
}
