const urlParser = require('url'),
      knex  = require('knex');

const ensureDbExists = async (url) => {
  const opts = urlParser.parse(url);
  const dbname = opts.path.slice(1);
  const conn = knex({client: 'pg', connection: url.replace(opts.path, '')});
  try {
    await conn.raw(`CREATE DATABASE \"${dbname}\"`);
  } catch(err) {
    //db already exists - ignore
    if(err.message.indexOf('already exists') < 0) {
      throw err;
    }
  }
  await conn.destroy();
};

const ensureDbIsClean = async (url) => {
  try {
    const conn = knex({client: 'pg', connection: url});
    await conn.raw('drop table if exists couchdb cascade');
    await conn.schema.dropTableIfExists('couchdb_progress');
    await conn.schema.dropTableIfExists('couch2pg_migrations');
    await conn.schema.dropTableIfExists('xmlforms_migrations');
    await conn.destroy();
  } catch(err) {
    if(err.message.indexOf('does not exist') < 0){
      throw err;
    }
  }
  await ensureDbExists(url);
};

const SELECT_VIEWS =
  'select table_name from INFORMATION_SCHEMA.views \
  WHERE table_schema = ANY (current_schemas(false)) \
  order by table_name';

class Pg {

  constructor(url) {
    this.conn = knex({client: 'pg', connection: url});
    this.schema = this.conn.schema;
  }

  async rows() {
    return (await this.conn.raw('select * from couchdb')).rows;
  }

  async views() {
    return (await this.conn.raw(SELECT_VIEWS)).rows;
  }

  async destroy() {
    await this.conn.destroy();
  }
}


module.exports = {
  Pg: Pg,
  ensureDbExists: ensureDbExists,
  ensureDbIsClean: ensureDbIsClean
};
