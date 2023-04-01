const path = require('path');
// Update with your config settings.

module.exports = {

  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, 'seo/db.sqlite3')
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  }

};