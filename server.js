/* =====================================================
   BIBLE KALOLSAVAM 2026
   RESULT PORTAL - BACKEND SERVER
===================================================== */

const express = require("express");
const path = require("path");

const app = express();


/* =====================================================
   PORT
===================================================== */

const PORT = process.env.PORT || 3000;



/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =====================================================
   STATIC FILES
===================================================== */

app.use(
    express.static(
        path.join(__dirname)
    )
);


/* =====================================================
   EDIT PASSKEY
===================================================== */

const EDIT_PASSKEY = "81111";


/* =====================================================
   RESULTS STORAGE
===================================================== */

/*
   IMPORTANT:
   This stores the results in server memory.

   There is NO demo data.

   Structure:

   results = {

       "Item Name": {

           "Category": [

               {
                   position: 1,
                   participant: "...",
                   parish: "...",
                   points: 10,
                   grade: "A",
                   shared: false
               }

           ]

       }

   }

*/

let results = {};


/* =====================================================
   OFFICIAL 15 PARISHES
===================================================== */

const PARISHES = [

    "St. Theresa of Avila Church, Uchakada",

    "Christ the King Church, Valiyavila",

    "St. Jacob's Church, Vattavila",

    "Assumption Forane Church, Vlathankara",

    "St. Mary's Church, Udhiyankulangara",

    "St. Francis Xavier's Church, Attupuram",

    "St. Joseph's Church, Kuzhichani",

    "St. Little Flower Church, Kunnanvila",

    "St. Little Flower Church, Puthenvila",

    "St. Mary's Church, Kunnuvila",

    "St. Joseph's Church, Kulathoor",

    "St. Antony's Church, Kakkavila",

    "St John Maria Vianey Church, Mavilakadavu",

    "St. Joseph's Church, Vettukad",

    "St. Antony's Church, Amaravila"

];


/* =====================================================
   HOME PAGE
===================================================== */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }
);


/* =====================================================
   CHECK SERVER
===================================================== */

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Bible Kalolsavam 2026 Result Portal server is running.",

            time:
                new Date().toISOString()

        });

    }
);


/* =====================================================
   GET RESULT
===================================================== */

app.get(
    "/api/results",
    (req, res) => {

        try {

            const item =
                req.query.item;

            const category =
                req.query.category;


            if (
                !item ||
                !category
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Item and category are required."

                });

            }


            const eventResults =
                results[item]?.[category] || [];


            return res.json({

                success: true,

                item: item,

                category: category,

                results:
                    eventResults

            });

        }

        catch (error) {

            console.error(
                "GET RESULT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load results."

            });

        }

    }
);


/* =====================================================
   GET ALL RESULTS
===================================================== */

app.get(
    "/api/all-results",
    (req, res) => {

        try {

            return res.json({

                success: true,

                results:
                    results

            });

        }

        catch (error) {

            console.error(
                "ALL RESULTS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load all results."

            });

        }

    }
);


/* =====================================================
   CHECK EDIT PASSKEY
===================================================== */

app.post(
    "/api/check-passkey",
    (req, res) => {

        try {

            const passkey =
                String(
                    req.body?.passkey || ""
                ).trim();


            if (!passkey) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Passkey is required."

                });

            }


            if (
                passkey ===
                EDIT_PASSKEY
            ) {

                return res.json({

                    success: true,

                    message:
                        "Access granted."

                });

            }


            return res.status(401).json({

                success: false,

                message:
                    "Incorrect passkey."

            });

        }

        catch (error) {

            console.error(
                "PASSKEY ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to check passkey."

            });

        }

    }
);


/* =====================================================
   SAVE / UPDATE RESULT
===================================================== */

app.post(
    "/api/results",
    (req, res) => {

        try {

            const {

                passkey,

                item,

                category,

                resultData

            } = req.body;


            /* -----------------------------------------
               CHECK PASSKEY
            ----------------------------------------- */

            if (
                passkey !==
                EDIT_PASSKEY
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Incorrect passkey."

                });

            }


            /* -----------------------------------------
               VALIDATE BASIC DATA
            ----------------------------------------- */

            if (
                !item ||
                !category ||
                !Array.isArray(
                    resultData
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid result data."

                });

            }


            /* -----------------------------------------
               CREATE ITEM
            ----------------------------------------- */

            if (
                !results[item]
            ) {

                results[item] = {};

            }


            /* -----------------------------------------
               CLEAN RESULT DATA
            ----------------------------------------- */

            const cleanedResults =
                resultData.map(
                    (result, index) => {

                        return {

                            position:
                                Number(
                                    result.position
                                ) ||
                                index + 1,


                            participant:
                                String(
                                    result.participant ||
                                    ""
                                ).trim(),


                            parish:
                                String(
                                    result.parish ||
                                    ""
                                ).trim(),


                            points:
                                Number(
                                    result.points
                                ) || 0,


                            grade:
                                String(
                                    result.grade ||
                                    ""
                                ).trim(),


                            shared:
                                result.shared === true ||
                                result.shared === "true"

                        };

                    }
                );


            /* -----------------------------------------
               SAVE CATEGORY
            ----------------------------------------- */

            results[item][category] =
                cleanedResults;


            console.log("");
            console.log(
                "=========================================="
            );
            console.log(
                "RESULT SAVED"
            );
            console.log(
                "Item:",
                item
            );
            console.log(
                "Category:",
                category
            );
            console.log(
                "Rows:",
                cleanedResults.length
            );
            console.log(
                "=========================================="
            );
            console.log("");


            return res.json({

                success: true,

                message:
                    "Result saved successfully.",

                item:
                    item,

                category:
                    category,

                results:
                    cleanedResults

            });

        }

        catch (error) {

            console.error(
                "SAVE RESULT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error while saving results."

            });

        }

    }
);


/* =====================================================
   DELETE RESULT
===================================================== */

app.delete(
    "/api/results",
    (req, res) => {

        try {

            const {

                passkey,

                item,

                category

            } = req.body;


            /* -----------------------------------------
               CHECK PASSKEY
            ----------------------------------------- */

            if (
                passkey !==
                EDIT_PASSKEY
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Incorrect passkey."

                });

            }


            /* -----------------------------------------
               CHECK RESULT
            ----------------------------------------- */

            if (
                results[item] &&
                results[item][category]
            ) {

                delete results[item][category];


                /*
                   Remove empty item object.
                */

                if (
                    Object.keys(
                        results[item]
                    ).length === 0
                ) {

                    delete results[item];

                }


                console.log(
                    "Result deleted:",
                    item,
                    category
                );


                return res.json({

                    success: true,

                    message:
                        "Result deleted successfully."

                });

            }


            return res.status(404).json({

                success: false,

                message:
                    "Result not found."

            });

        }

        catch (error) {

            console.error(
                "DELETE RESULT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error while deleting result."

            });

        }

    }
);


/* =====================================================
   PARISH POINTS
===================================================== */

/*
   Automatically calculates the total points
   of all 15 parishes from every saved result.

   IMPORTANT:

   Result rows are the source of truth.

   Every row contributes:

       result.parish
       result.points

   Shared rows are automatically included
   because they are normal result rows.
*/

app.get(
    "/api/parish-points",
    (req, res) => {

        try {

            /* -----------------------------------------
               START ALL 15 PARISHES AT ZERO
            ----------------------------------------- */

            const parishPoints = {};


            PARISHES.forEach(
                parish => {

                    parishPoints[
                        parish
                    ] = 0;

                }
            );


            /* -----------------------------------------
               GO THROUGH EVERY ITEM
            ----------------------------------------- */

            Object.values(
                results
            ).forEach(
                event => {

                    if (
                        !event ||
                        typeof event !== "object"
                    ) {

                        return;

                    }


                    /* ---------------------------------
                       GO THROUGH EVERY CATEGORY
                    --------------------------------- */

                    Object.values(
                        event
                    ).forEach(
                        categoryResults => {

                            if (
                                !Array.isArray(
                                    categoryResults
                                )
                            ) {

                                return;

                            }


                            /* -------------------------
                               GO THROUGH EVERY ROW
                            ------------------------- */

                            categoryResults.forEach(
                                result => {

                                    if (
                                        !result ||
                                        typeof result !== "object"
                                    ) {

                                        return;

                                    }


                                    const parish =
                                        String(
                                            result.parish ||
                                            ""
                                        ).trim();


                                    const points =
                                        Number(
                                            result.points
                                        ) || 0;


                                    if (!parish) {

                                        return;

                                    }


                                    /* ---------------------
                                       FIND OFFICIAL PARISH
                                    --------------------- */

                                    const matchedParish =
                                        PARISHES.find(
                                            officialParish =>

                                                officialParish
                                                    .trim()
                                                    .toLowerCase()
                                                ===
                                                parish
                                                    .trim()
                                                    .toLowerCase()
                                        );


                                    if (
                                        matchedParish
                                    ) {

                                        parishPoints[
                                            matchedParish
                                        ] += points;

                                    }

                                }
                            );

                        }
                    );

                }
            );


            /* -----------------------------------------
               CONVERT TO ARRAY
            ----------------------------------------- */

            const sorted =
                Object.entries(
                    parishPoints
                )
                .map(
                    ([parish, points]) => ({

                        parish,

                        points:
                            Number(points) || 0

                    })
                )
                .sort(
                    (a, b) => {

                        return (
                            b.points -
                            a.points
                        );

                    }
                );


            console.log(
                "PARISH POINTS:",
                sorted
            );


            return res.json({

                success: true,

                parishes:
                    sorted

            });

        }

        catch (error) {

            console.error(
                "PARISH POINTS ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to calculate parish points."

            });

        }

    }
);


/* =====================================================
   SERVER START
===================================================== */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");

        console.log(
            "=========================================="
        );

        console.log(
            " FORONA KALOLSAVAM 2026 RESULT PORTAL"
        );

        console.log(
            "=========================================="
        );

        console.log("");

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Open: http://localhost:${PORT}`
        );

        console.log("");

    }
);