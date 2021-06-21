const pgp = require('pg-promise')();

console.log("Initializing db");
const db = pgp({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

module.exports = {
    pgp,
    db,
}
