const fetch = require("node-fetch");
const db = require("../../../db");
const { ParameterizedQuery: PQ } = require('pg-promise');

// Creating a complete Parameterized Query with parameters:


export default async (req, res) => {
    let leaderboardResponse = await fetch("https://pokemongolive.com/_api/gbl.get_leaderboard", {
        headers: {
            accept: "application/json, text/plain, */*",
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            pragma: "no-cache",
        },
        body: JSON.stringify({ season: "current" }),
        method: "POST",
    })
    const leaderboard = await leaderboardResponse.json();
    console.log("Got leaderboard for date: ", new Date(leaderboard.last_updated));
    const findUpdated = new PQ({ text: 'SELECT * FROM LB_UPDATED WHERE updated = $1', values: [new Date(leaderboard.last_updated)] });

    try {
        const alreadyIn = db.db.one(findUpdated);
        if (alreadyIn) {
            res.json({
                ok: false,
                error: `Leaderboard for date ${new Date(leaderboard.last_updated)} already present.`
            });
            return;
        }
    } catch (e) { console.error(e) }
    console.log("If we are here we have a new leaderboard to insert!");
    // our set of columns, to be created only once (statically), and then reused,
    // to let it cache up its formatting templates for high performance:
    const cs = new db.pgp.helpers.ColumnSet(['trainer', 'team', 'rating', 'rank', 'position', 'battles', 'updated_at'], { table: 'LB_HISTORY' });

    // data input values:
    const values = leaderboard.trainers.map(player => ({
        'trainer': player.trainer_name,
        'team': player.team,
        'rating': player.rating,
        'rank': player.rank_level,
        'position': player.leaderboard_rank,
        'battles': player.total_battles,
        'updated_at': new Date(leaderboard.last_updated),
    }));

    // generating a multi-row insert query:
    const query = db.pgp.helpers.insert(values, cs);
    //=> INSERT INTO "tmp"("col_a","col_b") VALUES('a1','b1'),('a2','b2')

    // executing the query:
    await db.db.none(query);
    res.json(leaderboard);
}