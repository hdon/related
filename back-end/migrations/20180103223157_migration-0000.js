
exports.up = (knex, Promise) =>
  knex.schema.createTable('project', t => {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
  }).then(() =>
  knex.schema.createTable('entity', t => {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
  })).then(() =>
  knex.schema.createTable('related', t => {
    t.increments('id').unsigned().primary();
    t.integer('a').unsigned();
    t.integer('b').unsigned();
    t.integer('n').unsigned();
    t.index(['a', 'b']);
    t.index(['b', 'a']);
    t.index(['n']);
  }))
;

exports.down = (knex, Promise) =>
  knex.schema.dropTable('project')
  .then(() => 
    knex.schema.dropTable('entity')
  ).then(() =>
    knex.schema.dropTable('related')
  )
;
