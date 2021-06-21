const pgp = require('pg-promise')();

console.log("Initializing db");
const db = pgp(process.env.DATABASE_URL);

module.exports = {
    pgp,
    db,
}
