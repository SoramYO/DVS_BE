const config = {
    user: 'sa', // sql user
    password: '12345', //sql user password
    server: 'localhost', // if it does not work try- localhost
    database: 'DVS',
    options: {
        trustedconnection: true,
        enableArithAbort: true,
    },
    port: 1433
}

module.exports = config;