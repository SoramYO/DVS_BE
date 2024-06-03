const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.USER_DATABASE,
    host: 'db', // This should match the service name defined in docker-compose
    database: process.env.DATABASE,
    password: process.env.PASSWORD_DATABASE,
    port: 5432,
});

module.exports = pool;
