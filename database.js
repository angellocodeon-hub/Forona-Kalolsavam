/* =====================================================
   BIBLE KALOLSAVAM 2026
   RESULT PORTAL - DATABASE
===================================================== */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/* =====================================================
   DATABASE FILE
===================================================== */

const DB_PATH = path.join(
    __dirname,
    "bible_kalolsavam.db"
);

const db = new sqlite3.Database(
    DB_PATH,
    (error) => {

        if (error) {

            console.error(
                "Database connection error:",
                error
            );

        } else {

            console.log(
                "SQLite database connected."
            );

        }

    }
);


/* =====================================================
   CREATE TABLE
===================================================== */

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS results (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            item TEXT NOT NULL,

            category TEXT NOT NULL,

            position INTEGER NOT NULL,

            participant TEXT NOT NULL,

            house TEXT NOT NULL,

            points INTEGER DEFAULT 0,

            grade TEXT DEFAULT '',

            UNIQUE (
                item,
                category,
                position
            )

        )
    `);

});


/* =====================================================
   GET RESULTS
===================================================== */

function getResults(item, category) {

    return new Promise(
        (resolve, reject) => {

            const sql = `

                SELECT
                    position,
                    participant,
                    house,
                    points,
                    grade

                FROM results

                WHERE item = ?
                AND category = ?

                ORDER BY position ASC

            `;

            db.all(
                sql,
                [
                    item,
                    category
                ],
                (error, rows) => {

                    if (error) {

                        reject(error);

                        return;

                    }

                    resolve(rows);

                }
            );

        }
    );

}


/* =====================================================
   GET ALL RESULTS
===================================================== */

function getAllResults() {

    return new Promise(
        (resolve, reject) => {

            const sql = `

                SELECT
                    item,
                    category,
                    position,
                    participant,
                    house,
                    points,
                    grade

                FROM results

                ORDER BY
                    item,
                    category,
                    position

            `;

            db.all(
                sql,
                [],
                (error, rows) => {

                    if (error) {

                        reject(error);

                        return;

                    }

                    resolve(rows);

                }
            );

        }
    );

}


/* =====================================================
   SAVE RESULTS
===================================================== */

function saveResults(
    item,
    category,
    resultData
) {

    return new Promise(
        (resolve, reject) => {

            db.serialize(() => {

                db.run(
                    `
                    DELETE FROM results
                    WHERE item = ?
                    AND category = ?
                    `,
                    [
                        item,
                        category
                    ],
                    (error) => {

                        if (error) {

                            reject(error);

                            return;

                        }


                        const statement =
                            db.prepare(`

                                INSERT INTO results (

                                    item,
                                    category,
                                    position,
                                    participant,
                                    house,
                                    points,
                                    grade

                                )

                                VALUES (
                                    ?,
                                    ?,
                                    ?,
                                    ?,
                                    ?,
                                    ?,
                                    ?
                                )

                            `);


                        try {

                            resultData.forEach(
                                (result, index) => {

                                    statement.run(

                                        item,

                                        category,

                                        Number(
                                            result.position ||
                                            index + 1
                                        ),

                                        String(
                                            result.participant ||
                                            ""
                                        ),

                                        String(
                                            result.house ||
                                            ""
                                        ),

                                        Number(
                                            result.points ||
                                            0
                                        ),

                                        String(
                                            result.grade ||
                                            ""
                                        )

                                    );

                                }
                            );

                        }
                        catch (error) {

                            statement.finalize();

                            reject(error);

                            return;

                        }


                        statement.finalize(
                            (error) => {

                                if (error) {

                                    reject(error);

                                    return;

                                }

                                resolve(true);

                            }
                        );

                    }
                );

            });

        }
    );

}


/* =====================================================
   DELETE RESULTS
===================================================== */

function deleteResults(
    item,
    category
) {

    return new Promise(
        (resolve, reject) => {

            db.run(
                `
                DELETE FROM results
                WHERE item = ?
                AND category = ?
                `,
                [
                    item,
                    category
                ],
                function (error) {

                    if (error) {

                        reject(error);

                        return;

                    }

                    resolve(
                        this.changes
                    );

                }
            );

        }
    );

}


/* =====================================================
   HOUSE POINTS
===================================================== */

function getHousePoints() {

    return new Promise(
        (resolve, reject) => {

            const sql = `

                SELECT
                    house,
                    SUM(points) AS points

                FROM results

                GROUP BY house

                ORDER BY points DESC

            `;

            db.all(
                sql,
                [],
                (error, rows) => {

                    if (error) {

                        reject(error);

                        return;

                    }

                    resolve(rows);

                }
            );

        }
    );

}


/* =====================================================
   EXPORT FUNCTIONS
===================================================== */

module.exports = {

    getResults,

    getAllResults,

    saveResults,

    deleteResults,

    getHousePoints

};