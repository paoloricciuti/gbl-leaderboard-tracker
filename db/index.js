const pgp = require('pg-promise')();

console.log("Initializing db");
const db = pgp(`${process.env.DATABASE_URL}?ssl=true`);

module.exports = {
    pgp,
    db,
}
