/* =====================================================
   BIBLE KALOLSAVAM 2026
   RESULT PORTAL - FRONTEND
===================================================== */


/* =====================================================
   ITEMS
===================================================== */

const items = [
    "ലളിത ഗാനം (Boys)",
    "ലളിത ഗാനം (Girls)",
    "അഭിനയ ഗാനം",
    "കഥ പറയൽ",
    "സങ്കീർത്തനആലാപനം",
    "ശാസ്ത്രീയസംഗീതം",
    "പ്രസംഗം",
    "കഥാപ്രസംഗം",
    "നാടോടിനൃത്തം",
    "Bible Quiz",
    "തെരുവ് നാടകം",
    "നാടകം",
    "മാർഗംകളി"
];


let selectedItem = "";
let selectedCategory = "";
let currentResults = [];


/* =====================================================
   15 PARISHES
===================================================== */

const parishes = [

    {
        id: 1,
        name: "St. Theresa of Avila Church, Uchakada",
        points: 0
    },

    {
        id: 2,
        name: "Christ the King Church, Valiyavila",
        points: 0
    },

    {
        id: 3,
        name: "St. Jacob's Church, Vattavila",
        points: 0
    },

    {
        id: 4,
        name: "Assumption Forane Church, Vlathankara",
        points: 0
    },

    {
        id: 5,
        name: "St. Mary's Church, Udhiyankulangara",
        points: 0
    },

    {
        id: 6,
        name: "St. Francis Xavier's Church, Attupuram",
        points: 0
    },

    {
        id: 7,
        name: "St. Joseph's Church, Kuzhichani",
        points: 0
    },

    {
        id: 8,
        name: "St. Little Flower Church, Kunnanvila",
        points: 0
    },

    {
        id: 9,
        name: "St. Little Flower Church, Puthenvila",
        points: 0
    },

    {
        id: 10,
        name: "St. Mary's Church, Kunnuvila",
        points: 0
    },

    {
        id: 11,
        name: "St. Joseph's Church, Kulathoor",
        points: 0
    },

    {
        id: 12,
        name: "St. Antony's Church, Kakkavila",
        points: 0
    },

    {
        id: 13,
        name: "St John Maria Vianey Church, Mavilakadavu",
        points: 0
    },

    {
        id: 14,
        name: "St. Joseph's Church, Vettukad",
        points: 0
    },

    {
        id: 15,
        name: "St. Antony's Church, Amaravila",
        points: 0
    }

];


let allParishes = [...parishes];

let showingAllParishes = false;


/* =====================================================
   LOAD PARISH POINTS
===================================================== */

async function loadParishPoints() {

    try {

        const response =
            await fetch(
                "/api/parish-points",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "PARISH DATA:",
            data
        );


        /* Reset */

        allParishes.forEach(
            parish => {

                parish.points = 0;

            }
        );


        /* Read server data */

        if (
            data.success &&
            Array.isArray(data.parishes)
        ) {

            data.parishes.forEach(
                serverParish => {

                    const serverName =
                        String(
                            serverParish.parish || ""
                        )
                        .trim()
                        .toLowerCase();


                    const matchingParish =
                        allParishes.find(
                            parish =>
                                parish.name
                                    .trim()
                                    .toLowerCase()
                                ===
                                serverName
                        );


                    if (matchingParish) {

                        matchingParish.points =
                            Number(
                                serverParish.points
                            ) || 0;

                    }

                }
            );

        }


        sortParishes();

        renderParishes();

    }

    catch (error) {

        console.error(
            "Error loading parish points:",
            error
        );


        /*
           Even when there are no results,
           keep all 15 parishes visible
           with 0 points.
        */

        allParishes.forEach(
            parish => {

                parish.points = 0;

            }
        );


        sortParishes();

        renderParishes();

    }

}


/* =====================================================
   SORT PARISHES
===================================================== */

function sortParishes() {

    allParishes.sort(
        (a, b) => {

            return (
                Number(b.points || 0) -
                Number(a.points || 0)
            );

        }
    );

}


/* =====================================================
   RENDER PARISHES
===================================================== */

function renderParishes() {

    const container =
        document.getElementById(
            "parishPointsList"
        );


    const showMoreButton =
        document.getElementById(
            "moreParishesButton"
        );


    if (!container) {

        console.error(
            "parishPointsList not found in HTML"
        );

        return;

    }


    /*
       Initially show top 3.
       More button shows all 15.
    */

    const parishesToShow =
        showingAllParishes
            ? allParishes
            : allParishes.slice(0, 3);


    container.innerHTML = "";


    parishesToShow.forEach(
        (parish, index) => {

            const position =
                index + 1;


            let positionClass = "";


            if (position === 1) {

                positionClass =
                    "parish-first";

            }

            else if (position === 2) {

                positionClass =
                    "parish-second";

            }

            else if (position === 3) {

                positionClass =
                    "parish-third";

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                `parish-row ${positionClass}`;


            row.innerHTML = `

                <div class="parish-name-area">

                    <span class="parish-position">
                        ${position}
                    </span>

                    <span class="parish-name">
                        ${escapeHtml(
                            parish.name
                        )}
                    </span>

                </div>


                <span class="parish-points">
                    ${Number(
                        parish.points || 0
                    )}
                </span>

            `;


            container.appendChild(row);

        }
    );


    /* More / Less button */

    if (showMoreButton) {

        if (
            allParishes.length > 3
        ) {

            showMoreButton.style.display =
                "block";


            showMoreButton.textContent =
                showingAllParishes
                    ? "കുറച്ച് കാണുക ▲"
                    : "കൂടുതൽ ഇടവകകൾ കാണുക ▼";

        }

        else {

            showMoreButton.style.display =
                "none";

        }

    }

}


/* =====================================================
   TOGGLE PARISHES
===================================================== */

function toggleParishes() {

    showingAllParishes =
        !showingAllParishes;


    renderParishes();

}


/* =====================================================
   LOAD ITEMS
===================================================== */

function loadItems() {

    const itemList =
        document.getElementById(
            "itemsList"
        );


    if (!itemList) {
        return;
    }


    itemList.innerHTML = "";


    items.forEach(
        (item, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "item-button";


            button.innerHTML = `

                <span class="item-number">
                    ${String(
                        index + 1
                    ).padStart(2, "0")}
                </span>

                <span class="item-name">
                    ${escapeHtml(item)}
                </span>

                <span class="item-arrow">
                    →
                </span>

            `;


            button.style.animation =
                `houseSlide .5s ${
                    index * 0.05
                }s both`;


            button.onclick = () => {

                selectItem(item);

            };


            itemList.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   SELECT ITEM
===================================================== */

function selectItem(item) {

    selectedItem =
        item;


    const eventTitle =
        document.getElementById(
            "categoryEvent"
        );


    if (eventTitle) {

        eventTitle.textContent =
            item;

    }


    showPage(
        "categoryPage"
    );

}


/* =====================================================
   OPEN RESULT
===================================================== */

async function openResults(category) {

    if (!selectedItem) {
        return;
    }


    selectedCategory =
        category;


    const eventTitle =
        document.getElementById(
            "resultEvent"
        );


    const categoryTitle =
        document.getElementById(
            "resultCategory"
        );


    if (eventTitle) {

        eventTitle.textContent =
            selectedItem;

    }


    if (categoryTitle) {

        categoryTitle.textContent =
            category;

    }


    showPage(
        "resultPage"
    );


    await loadResultTable();

}


/* =====================================================
   LOAD RESULT TABLE
===================================================== */

async function loadResultTable() {

    const table =
        document.getElementById(
            "resultTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty"
            >

                ഫലം ലോഡ് ചെയ്യുന്നു...

            </td>

        </tr>

    `;


    try {

        const url =
            `/api/results?item=${
                encodeURIComponent(
                    selectedItem
                )
            }&category=${
                encodeURIComponent(
                    selectedCategory
                )
            }`;


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load results"
            );

        }


        currentResults =
            Array.isArray(data.results)
                ? data.results
                : [];


        renderResultTable();

    }

    catch (error) {

        console.error(
            "Result loading error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty"
                >

                    ഫലം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.

                    <br><br>

                    Please check that the server is running.

                </td>

            </tr>

        `;

    }

}


/* =====================================================
   DISPLAY RESULT TABLE
===================================================== */

function renderResultTable() {

    const table =
        document.getElementById(
            "resultTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (
        !currentResults ||
        currentResults.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty"
                >

                    ഈ ഇനത്തിന്റെയും വിഭാഗത്തിന്റെയും
                    ഫലം ഇതുവരെ ലഭ്യമല്ല.

                </td>

            </tr>

        `;

        return;

    }


    currentResults.forEach(
        (result, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            let positionClass = "";


            if (
                Number(result.position) === 1
            ) {

                positionClass =
                    "position-first";

            }

            else if (
                Number(result.position) === 2
            ) {

                positionClass =
                    "position-second";

            }

            else if (
                Number(result.position) === 3
            ) {

                positionClass =
                    "position-third";

            }


            const position =
                Number(
                    result.position
                );


            let positionText;


            if (
                result.shared === true ||
                result.shared === "true"
            ) {

                positionText =
                    position === 1
                        ? "🥇 Shared 1st"
                        : position === 2
                        ? "🥈 Shared 2nd"
                        : position === 3
                        ? "🥉 Shared 3rd"
                        : `Shared ${position}`;

            }

            else {

                positionText =
                    position === 1
                        ? "🥇 1st"
                        : position === 2
                        ? "🥈 2nd"
                        : position === 3
                        ? "🥉 3rd"
                        : result.position;

            }


            row.innerHTML = `

                <td
                    class="${positionClass}"
                >
                    ${escapeHtml(
                        positionText
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        result.participant || ""
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        result.parish || ""
                    )}
                </td>


                <td>
                    ${Number(
                        result.points || 0
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        result.grade || ""
                    )}
                </td>

            `;


            row.style.animationDelay =
                `${index * 0.1}s`;


            table.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   EDIT BUTTON
===================================================== */

function editResults() {

    const passkey =
        prompt(
            "Enter Edit Passkey:"
        );


    if (passkey === null) {
        return;
    }


    if (!passkey.trim()) {

        alert(
            "Please enter the passkey."
        );

        return;

    }


    checkPasskey(
        passkey.trim()
    );

}


/* =====================================================
   CHECK PASSKEY
===================================================== */

async function checkPasskey(passkey) {

    try {

        const response =
            await fetch(
                "/api/check-passkey",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            passkey
                        })

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                "Incorrect passkey."
            );

            return;

        }


        openEditor(
            passkey
        );

    }

    catch (error) {

        console.error(
            "Passkey error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


/* =====================================================
   CREATE EDITOR ROW
===================================================== */

function createEditorRow(
    result,
    position,
    shared = false
) {

    const row =
        document.createElement(
            "tr"
        );


    row.dataset.position =
        String(position);


    row.dataset.shared =
        shared
            ? "true"
            : "false";


    if (shared) {

        row.className =
            "shared-prize-row";

    }


    row.innerHTML = `

        <td>

            <input
                type="number"
                class="edit-position"
                value="${position}"
                min="1"
                readonly
            >

            ${
                shared
                    ? `
                        <div
                            style="
                                font-size:11px;
                                margin-top:4px;
                                opacity:.8;
                            "
                        >
                            SHARED
                        </div>
                      `
                    : ""
            }

        </td>


        <td>

            <input
                type="text"
                class="edit-participant"
                value="${
                    escapeAttribute(
                        result?.participant || ""
                    )
                }"
                placeholder="Participant name"
            >

        </td>


        <td>

            <input
                type="text"
                class="edit-parish"
                value="${
                    escapeAttribute(
                        result?.parish || ""
                    )
                }"
                placeholder="Parish"
            >

        </td>


        <td>

            <input
                type="number"
                class="edit-points"
                value="${
                    result &&
                    result.points !== undefined
                        ? result.points
                        : 0
                }"
                min="0"
            >

        </td>


        <td>

            <input
                type="text"
                class="edit-grade"
                value="${
                    escapeAttribute(
                        result?.grade || ""
                    )
                }"
                placeholder="Grade"
            >

        </td>

    `;


    return row;

}


/* =====================================================
   OPEN RESULT EDITOR
===================================================== */

function openEditor(passkey) {

    const table =
        document.getElementById(
            "resultTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    /*
       If there are existing results,
       load them.

       If there are no results,
       always create three prize rows:
       1st, 2nd, 3rd.
    */

    if (
        currentResults &&
        currentResults.length > 0
    ) {

        currentResults.forEach(
            result => {

                const position =
                    Number(
                        result.position
                    ) || 1;


                const shared =
                    result.shared === true ||
                    result.shared === "true";


                const row =
                    createEditorRow(
                        result,
                        position,
                        shared
                    );


                table.appendChild(
                    row
                );

            }
        );

    }

    else {

        for (
            let position = 1;
            position <= 3;
            position++
        ) {

            const row =
                createEditorRow(
                    {
                        position,
                        participant: "",
                        parish: "",
                        points: 0,
                        grade: ""
                    },
                    position,
                    false
                );


            table.appendChild(
                row
            );

        }

    }


    addSharedPrizeControls();

    addEditorButtons(
        passkey
    );

}


/* =====================================================
   SHARED PRIZE CONTROLS
===================================================== */

function addSharedPrizeControls() {

    const tableWrapper =
        document.querySelector(
            ".table-wrapper"
        );


    if (!tableWrapper) {
        return;
    }


    const oldControls =
        document.getElementById(
            "sharedPrizeControls"
        );


    if (oldControls) {

        oldControls.remove();

    }


    const controls =
        document.createElement(
            "div"
        );


    controls.id =
        "sharedPrizeControls";


    controls.style.marginTop =
        "15px";


    controls.style.padding =
        "12px";


    controls.style.textAlign =
        "center";


    controls.style.borderRadius =
        "10px";


    controls.style.background =
        "rgba(0, 120, 255, 0.08)";


    controls.innerHTML = `

        <div
            style="
                margin-bottom:10px;
                font-weight:bold;
            "
        >
            Shared Prize
        </div>


        <button
            type="button"
            class="shared-prize-button"
            data-position="1"
        >
            Shared 1st
        </button>


        <button
            type="button"
            class="shared-prize-button"
            data-position="2"
        >
            Shared 2nd
        </button>


        <button
            type="button"
            class="shared-prize-button"
            data-position="3"
        >
            Shared 3rd
        </button>

    `;


    tableWrapper.appendChild(
        controls
    );


    controls
        .querySelectorAll(
            ".shared-prize-button"
        )
        .forEach(
            button => {

                button.onclick = () => {

                    addSharedPrize(
                        Number(
                            button.dataset.position
                        )
                    );

                };

            }
        );

}


/* =====================================================
   ADD SHARED PRIZE
===================================================== */

function addSharedPrize(position) {

    const table =
        document.getElementById(
            "resultTable"
        );


    if (!table) {
        return;
    }


    /*
       Do not create duplicate
       shared row for same prize.
    */

    const existingShared =
        table.querySelector(
            `.shared-prize-row[data-position="${position}"]`
        );


    if (existingShared) {

        alert(
            `Shared ${position}st/nd/rd already added.`
        );

        return;

    }


    /*
       Find the main prize row.
    */

    const rows =
        Array.from(
            table.querySelectorAll("tr")
        );


    const mainRow =
        rows.find(
            row =>
                row.dataset.position ===
                String(position) &&
                row.dataset.shared !==
                "true"
        );


    if (!mainRow) {

        alert(
            "Prize row not found."
        );

        return;

    }


    /*
       Create blank shared row.
    */

    const sharedRow =
        createEditorRow(
            {
                position,
                participant: "",
                parish: "",
                points: 0,
                grade: ""
            },
            position,
            true
        );


    /*
       Insert immediately
       below the selected prize.
    */

    mainRow.after(
        sharedRow
    );


    /*
       Focus participant field.
    */

    const participantInput =
        sharedRow.querySelector(
            ".edit-participant"
        );


    if (participantInput) {

        participantInput.focus();

    }

}


/* =====================================================
   EDITOR BUTTONS
===================================================== */

function addEditorButtons(passkey) {

    const tableWrapper =
        document.querySelector(
            ".table-wrapper"
        );


    if (!tableWrapper) {
        return;
    }


    const oldControls =
        document.getElementById(
            "editorControls"
        );


    if (oldControls) {

        oldControls.remove();

    }


    const controls =
        document.createElement(
            "div"
        );


    controls.id =
        "editorControls";


    controls.style.marginTop =
        "20px";


    controls.style.display =
        "flex";


    controls.style.gap =
        "10px";


    controls.style.justifyContent =
        "center";


    controls.style.flexWrap =
        "wrap";


    controls.innerHTML = `

        <button
            type="button"
            id="saveResultsButton"
        >
            💾 SAVE RESULTS
        </button>


        <button
            type="button"
            id="cancelEditButton"
        >
            CANCEL
        </button>

    `;


    tableWrapper.appendChild(
        controls
    );


    document.getElementById(
        "saveResultsButton"
    ).onclick = () => {

        saveEditedResults(
            passkey
        );

    };


    document.getElementById(
        "cancelEditButton"
    ).onclick = () => {

        controls.remove();


        const sharedControls =
            document.getElementById(
                "sharedPrizeControls"
            );


        if (sharedControls) {

            sharedControls.remove();

        }


        renderResultTable();

    };

}


/* =====================================================
   SAVE EDITED RESULTS
===================================================== */

async function saveEditedResults(passkey) {

    const rows =
        document.querySelectorAll(
            "#resultTable tr"
        );


    const resultData = [];


    rows.forEach(
        (row, index) => {

            const participantInput =
                row.querySelector(
                    ".edit-participant"
                );


            const parishInput =
                row.querySelector(
                    ".edit-parish"
                );


            const pointsInput =
                row.querySelector(
                    ".edit-points"
                );


            const gradeInput =
                row.querySelector(
                    ".edit-grade"
                );


            const positionInput =
                row.querySelector(
                    ".edit-position"
                );


            if (!participantInput) {
                return;
            }


            const participant =
                participantInput.value.trim();


            const parish =
                parishInput
                    ? parishInput.value.trim()
                    : "";


            const points =
                pointsInput
                    ? Number(
                        pointsInput.value || 0
                    )
                    : 0;


            const grade =
                gradeInput
                    ? gradeInput.value.trim()
                    : "";


            const position =
                positionInput
                    ? Number(
                        positionInput.value ||
                        row.dataset.position ||
                        index + 1
                    )
                    : Number(
                        row.dataset.position ||
                        index + 1
                    );


            /*
               Ignore completely blank rows.
            */

            if (!participant) {
                return;
            }


            resultData.push({

                position:
                    position,

                participant:
                    participant,

                parish:
                    parish,

                points:
                    points,

                grade:
                    grade,

                shared:
                    row.dataset.shared ===
                    "true"

            });

        }
    );


    /*
       Allow saving empty result.
    */

    if (
        resultData.length === 0
    ) {

        if (
            !confirm(
                "No participant data entered. Save empty result?"
            )
        ) {

            return;

        }

    }


    /*
       Disable save button while saving.
    */

    const saveButton =
        document.getElementById(
            "saveResultsButton"
        );


    if (saveButton) {

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Saving...";

    }


    try {

        const response =
            await fetch(
                "/api/results",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            passkey:

                                passkey,

                            item:

                                selectedItem,

                            category:

                                selectedCategory,

                            resultData:

                                resultData

                        })

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to save results."
            );

        }


        alert(
            "✅ Result saved successfully!"
        );


        /*
           Reload item result.
        */

        await loadResultTable();


        /*
           Reload parish totals.
        */

        await loadParishPoints();

    }

    catch (error) {

        console.error(
            "Save error:",
            error
        );


        alert(
            "Unable to connect to the server.\n\n" +
            "Please make sure server.js is running."
        );

    }

    finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "💾 SAVE RESULTS";

        }

    }

}


/* =====================================================
   DELETE RESULT
===================================================== */

async function deleteCurrentResults() {

    const passkey =
        prompt(
            "Enter Edit Passkey:"
        );


    if (
        passkey !== "81111"
    ) {

        alert(
            "Incorrect passkey."
        );

        return;

    }


    if (
        !confirm(
            "Delete this entire result?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                "/api/results",
                {

                    method: "DELETE",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            passkey,

                            item:
                                selectedItem,

                            category:
                                selectedCategory

                        })

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Delete failed."
            );

            return;

        }


        alert(
            "Result deleted."
        );


        await loadResultTable();

        await loadParishPoints();

    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

    }

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(
            page => {

                page.classList.remove(
                    "active"
                );

            }
        );


    const page =
        document.getElementById(
            pageId
        );


    if (!page) {
        return;
    }


    page.classList.add(
        "active"
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =====================================================
   HOME
===================================================== */

function goHome() {

    showPage(
        "homePage"
    );

}


/* =====================================================
   CATEGORY
===================================================== */

function goCategory() {

    showPage(
        "categoryPage"
    );

}


/* =====================================================
   SECURITY HELPERS
===================================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHtml(
        value
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadParishPoints();

        loadItems();

    }
);