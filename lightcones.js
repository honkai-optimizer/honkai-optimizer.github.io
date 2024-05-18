
const ownedLCList = document.getElementById("owned_character_list");
const createLCList = document.getElementById("create_character_list");
const dialogContainer = document.getElementById("dialog_container");
const addDialog = document.getElementById("add_character_dialog");
const editDialog = document.getElementById("edit_character_dialog");
const paths = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let paths_on_owned = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let paths_on_create = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let lightCones;

async function fetchJSON() {
    await fetch('hsr-data/light_cones.json')
        .then(response => response.json())
        .then(data => {
            lightCones = data;
        });
}

function initialize() {
    lightCones.forEach(name => {
        const val = localStorage.getItem("lc_" + name);
        if (val != null) addLCToOwnedList(name)
        else addLCToCreateList(name);
    });
    dialogContainer.addEventListener("click", e => {
        if (e.target === dialogContainer) {
            closeDialog();
        }
    });
}

function addLCToCreateList(name) {
    const path = lightCones[name].path;
    const card = createDiv(["mini_card", "flex_col", lightCones[name].path]);
    const withSpaces = addSpaces(name);
    card.id = name;
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/lightcones/${name}.png" height="124px" width="112px">
            <div class="info_text flex_col">${withSpaces}</div>
        </div>
    `;
    createLCList.append(card);
    card.onclick = e => {
        localStorage.setItem("lc_" + name, JSON.stringify({
            key: name,
            path: lightCones[withSpaces].path,
            level: 1,
            ascension: 0,
            superimposed: 1,
            location: "Inventory"
        }));
        closeDialog();
        addLCToOwnedList(name);
        card.remove();
    }
}

function addLCToOwnedList(name) {
    const val = JSON.parse(localStorage.getItem("lc_" + name));
    const card = createDiv(["lightcone", "card", "flex_col", val.type]);
    card.id = name;
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/lightcones/${name}.png" height="124px" width="112px">
            <div class="flex_col">
                <img src="./icons/path/path_${val.path}.png" height="24" width="24">
            </div>
            <div class="infoText">
                <div>
                    <p>${addSpaces(name)}<br><br>
                    Lvl. ${val.level} S${val.superimposed}</p>
                </div>
                <img src="./icons/rarity/${lightCones[addSpaces(name)].rarity}.png" height="30px" width="128px">
            </div>
        </div>
        <div class="location dropdown" onclick="changeLocation(name)">
            <img src="./icons/chars/${val.location}.png">
            <p>${val.location}</p>
            <i class="fa fa-chevron-down"></i>
        </div>
        <div class="edit button">
        </div>
        <div class="delete button">
        </div>
    `;
    ownedCharList.append(card);
    applyFilter('owned');
    sortCards(ownedCharList);
}
