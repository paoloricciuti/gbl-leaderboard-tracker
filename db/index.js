const pgp = require('pg-promise')();

console.log("Initializing db");
const db = pgp({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
});

module.exports = {
    pgp,
    db,
}
