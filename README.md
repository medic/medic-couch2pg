# medic-analytics
Software for creating read-only replicas of Medic Mobile data, using PostgreSQL v9.4

## Required Environment Variables

Environment Variables will be used for confiuration. A number of variables
are required.

* `POSTGRESQL_URL`: a URL used by pg libs to connect to postgres.
  * tcp: `postgres://user:password@site:port/dbname`
  * unix domain socket: e.g. `postgres:///dbname?host=/var/run/postgresql`
  * parameters: e.g. `postgres://localhost/dbname?client_encoding=UTF8`
* `POSTGRESQL_TABLE`: name of table for storing CouchDB data.
* `POSTGRESQL_COLUMN`: name of the `jsonb` column in `POSTGRESQL_TABLE` for
  storing CouchDB data.
* `COUCHDB_URL`: a full path URL to `_all_doc`, including `user:pass@` and `include_docs=true`.
  * e.g. `https://user:pass@localhost/medic/_all_docs?include_docs=true`
* `COUCH2PG_SLEEP_MINS`: number of minutes between checking for updates.

Optional variables:

* `COUCH2PG_DOC_LIMIT`: maximum number of full documents to request and download from couch during any particular iterative run. this is useful to avoid out of memory errors. Must be balanced properly with `COUCH2PG_SLEEP_MINS` to keep up with new data but not overload.

## Example usage

Run `node mainloop`.

## Process

1. Ensure Postgres has jsonb storage location ready.
1. All record UUIDs are taken in from CouchDB using GET `_all_docs` and `include_docs=false`
1. Fetched UUIDs are compared against existing records in Postgres.
1. Missing docs are taken in from CouchDB using POST `_all_docs` and `include_docs=true`.
1. Fetched docs are iterated into distinct JSON objects.
1. Each JSON object is added to Postgres as jsonb.

### Missing steps:

1. All materialized views are refreshed.

No materialized views yet exist.
