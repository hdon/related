/* This migration adds the foreign key identifying the project entities
 * belong to. My interpretation of how to represent your old entity table
 * in the new schema is to duplicate each entity for each project you have.
 * If you have no projects, a project called "Default" will be added for
 * you to save your entities.
 *
 * This migration is complicated to support sqlite3 which has a limitation
 * in ALTER TABLE that makes it impossible to add a NOT NULL DEFAULT NULL
 * column. (You can still add them in CREATE TABLE.)
 *
 * Actually... a simpler approach would have been to supply a default value
 * and then later remove it, but I've already written this one, so, we're
 * sticking with it :P
 */

exports.up = (knex, Promise) =>
  knex.from('project').count('id as count').then($ => {
    console.log('n=', $.count);
    return $.count || knex.insert({ name: 'Default'}).into('project')
  })
  .then(() => knex.schema.renameTable('entity', '__deleteme_entity'))
  .then(() => knex.schema.createTable('entity', t => {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
    t.integer('project').notNull();
    t.foreign('project').references('project.id');
  }))
  .then(() => knex.raw(`
    insert into entity (id, name, project)
    select __deleteme_entity.id, __deleteme_entity.name, project.id
    from __deleteme_entity
    join project
  `))
  .then(() => knex.schema.dropTable('__deleteme_entity'))
;

exports.down = (knex, Promise) => null
