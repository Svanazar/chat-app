const db = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'db',
        user: 'root',
        password: 'blalbalba',
        database: 'chatapp'
    }
})

module.exports = db