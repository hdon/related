/* This migration enforces the use of the "n" column to express the degree
 * of relatedness that each row of the related table represents, and places
 * a uniqueness constraint on the pair (a,b) to help keep the number of
 * such rows down. It also removes the primary key "id" 
 */

exports.up = (knex, Promise) =>
  knex.schema.renameTable('related', '__deleteme_related')
  .then(() => knex.schema.createTable('related', t => {
    t.integer('a').unsigned(); // TODO XXX NOT NULL DUH
    t.integer('b').unsigned();
    t.integer('n').unsigned();
    /* TODO maybe a CHECK constraint to ensure a<b or something? for now,
     * please ensure this yourself
     */
    t.primary(['a', 'b']);
    t.index(['b', 'a'], 'related_b_a_index_2');
    t.index(['n'], 'related_n_index_2');
  }))
  /* NOTE I don't believe knex supports INSERT ... SELECT ergo knex.raw() */
  .then(() => knex.raw(`
    insert into related (a, b, n)
    select a, b, count(*)
    from __deleteme_related
    group by a, b
  `))
  .then(() => knex.schema.dropTable('__deleteme_related'))
;

exports.down = (knex, Promise) =>
  knex.schema.renameTable('related', '__deleteme_related')
  /* copied from migration 20180103223157_migration-0000.js :| */
  .then(() => knex.schema.createTable('related', t => {
    t.increments('id').unsigned().primary();
    t.integer('a').unsigned();
    t.integer('b').unsigned();
    t.integer('n').unsigned();
    t.index(['a', 'b']);
    t.index(['b', 'a']);
    t.index(['n']);
  }))
  .then(() => knex('__deleteme_related').max('n'))
  .then(maxN => Promise.all(
    (Array(maxN['max(`n`)']).fill()).map((ignore, m) => knex.raw(`
      insert into related (a, b)
      select a, b from __deleteme_related
      where n <= ${m}+1
    `))
  )).then(() => knex.schema.dropTable('__deleteme_related'))
;
