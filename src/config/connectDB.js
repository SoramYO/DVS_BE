var config = require('./dbconfig');
const sql = require('mssql');

const connectDB = new sql.ConnectionPool(config).connect().then(pool => {
    console.log("Connect success")
    return pool;
}
);

module.exports = {
    connectDB: connectDB,
    sql: sql
};

