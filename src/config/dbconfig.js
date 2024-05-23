const config = {
    user: 'diamond', // sql user
    password: 'Sql12345', //sql user password
    server: 'diamond1234.database.windows.net', // if it does not work try- localhost
    database: 'DiamondValuation',
    options: {
        encrypt: true,
        enableArithAbort: true
    },
    port: 1433
}

module.exports = config;