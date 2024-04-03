const names = ['Acheron','Argenti','Arlan','Asta','Aventurine','Bailu','BlackSwan','Blade','Boothill','Bronya','Clara','DanHeng','DanHengIL','DrRatio','FuXuan','Gallagher','Gepard','Guinaifen','Hanya','Herta','Himeko','Hook','Huohuo','JingYuan','Jingliu','Kafka','Luka','Luocha','Lynx','March7th','Misha','Natasha','Pela','Qingque','Robin','RuanMei','Sampo','Seele','Serval','SilverWolf','Sparkle','Sushang','Tingyun','TopazAndNumby','TrailblazerFire','TrailblazerPhysical','Welt','Xueyi','Yanqing','Yukong',];

const ownedCharList = document.getElementById("ownedCharacterList");
const createCharList = document.getElementById("createCharacterList");
const dialogContainer = document.getElementById("dialogContainer");
const addDialog = document.getElementById("addCharacterDialog");
const editDialog = document.getElementById("editCharacterDialog");
let characterObjects;
let relicRolls;
let relicStats;
let relicSets;
let lightCones;

async function fetchJSON() {
    await fetch('./hsr-data/characters.json')
    .then(response => response.json())
    .then(data => {
        characterObjects = data;
    });
    await fetch('hsr-data/light_cones.json')
    .then(response => response.json())
    .then(data => {
        lightCones = data;
    });
    await fetch('hsr-data/relic_roll_vals.json')
    .then(response => response.json())
    .then(data => {
        relicRolls = data;
    });
    await fetch('hsr-data/relic_sets.json')
    .then(response => response.json())
    .then(data => {
        relicSets = data;
    });
    await fetch('hsr-data/relic_stat_vals.json')
    .then(response => response.json())
    .then(data => {
        relicStats = data;
    });
}

function initialize() {
    names.forEach(name => {
        const val = localStorage.getItem("char_" + name);
        if (val != null) addCharToOwnedList(name)
        else addCharToCreateList(name);
    });
    dialogContainer.addEventListener("click", e => {
        if (e.target === dialogContainer)
        closeDialog();
    });
}

function addCharToCreateList(character) {
    const card = createStyledDiv("miniCard");
    card.id = character;
    let withSpaces = addSpaces(character);
    card.innerHTML = /*HTML*/ `
        <div class="infoContainer">
            <img class="portrait" src="./icons/chars/Codex Avatar_${withSpaces}.png" height="124px" width="112px">
            <div class="infoText">${withSpaces}</div>
        </div>
    `;
    createCharList.append(card);
    card.onclick = e => {
        localStorage.setItem("char_" + character, JSON.stringify({
            key: withSpaces,
            level: 1,
            ascension: 0,
            traces: {
                basic: 1,
                skill: 1,
                ultimate: 1
            },
            eidolon: 0,
            equip: {
                lc: null,
                head: null,
                hands: null,
                body: null,
                foot: null,
                orb: null,
                rope: null
            }
        }));
        closeDialog();
        addCharToOwnedList(character);
        card.remove();
    }
}



function addCharToOwnedList(character) {
    const val = JSON.parse(localStorage.getItem("char_" + character));
    const card = createStyledDiv("characterCard");
    card.id = character
    card.innerHTML = /*HTML*/ `
        <div class="infoContainer">
            <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(character)}.png" height="124px" width="112px">
            <div class="infoText">
                <p>${val.key}<br><br>
                Lvl. ${val.level} E${val.eidolon}</p>
                <div class="cardTraces">
                    <div class="traceCircle">${val.traces.basic}</div>
                    <div class="traceCircle">${val.traces.skill}</div>
                    <div class="traceCircle">${val.traces.ultimate}</div>
                </div>
            </div>
        </div>
        <div class="equipmentDisplay">
            <img src="./icons/lightcones/empty.png" height="38px" width="38px"><!-- light cone -->
            <img src="./icons/relic/Default/head.png" height="38px" width="38px"><!-- head -->
            <img src="./icons/relic/Default/hands.png" height="38px" width="38px"><!-- hands -->
            <img src="./icons/relic/Default/body.png" height="38px" width="38px"><!-- body -->
            <img src="./icons/relic/Default/foot.png" height="38px" width="38px"><!-- foot -->
            <img src="./icons/relic/Default/orb.png" height="38px" width="38px"><!-- orb -->
            <img src="./icons/relic/Default/rope.png" height="38px" width="38px"><!-- rope -->
        </div>
    `;
    card.onclick = e => openCharacterInfo(card.id);
    ownedCharList.append(card);
    sortCards(ownedCharList);
}

function deleteCharacter(character) {
    if (confirm("Are you sure you want to delete " + character + "?")) {
        localStorage.removeItem("char_" + character);
        document.getElementById(character).remove();
        addCharToCreateList(character);
        sortCards(createCharList);
        closeDialog();
    }
}

function deleteAllCharacters() {
    if (confirm("Are you sure you want to delete all characters?")) {
        names.forEach(character => {
        localStorage.removeItem("char_" + character);
        let card = document.getElementById(character);
        if (card != null) {
            card.remove();
            addCharToCreateList(character);
        }
        });
        sortCards(createCharList);
    }
    //TODO: Remove characters from relics and lightcones as well
}

function createStyledDiv(list) {
    const div = document.createElement("div")
    if (list.constructor === Array) div.classList.add(...list);
    else div.classList.add(list);
    return div;
}

function openCharacterInfo(character) {
    const charObject = JSON.parse(localStorage.getItem("char_" + character));
    const stats = calculateStats(charObject);
    editDialog.innerHTML = /*HTML*/ `
        <button id="deleteCharacter" onclick="deleteCharacter(${character})">Delete Character</button>
        <div id="editInfoContainer">
            <div id="statContainer">
                <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(character)}.png" height="160px" width="160px">
                <div class="statText" id="hp">HP: ${stats.hp}</div>
                <div class="statText" id="atk">ATK: ${stats.atk}</div>
                <div class="statText" id="def">DEF: ${stats.def}</div>
                <div class="statText" id="speed">SPD: ${stats.spd}</div>
                <div class="statText" id="crit_rate">Crit Rate: ${stats.crit_rate}</div>
                <div class="statText" id="crit_dmg">Crit DMG: ${stats.crit_dmg}</div>
                <div class="statText" id="element_damage">HP: </div>
                <div class="statText" id="effect_hr">HP: </div>
                <div class="statText" id="break_effect">HP: </div>
                <div class="statText" id="energy_regeneration_rate">HP: </div>
                <div class="statText" id="outgoing_healing">HP: </div>
                <div class="statText" id="effect_res">HP: </div>
            </div>
            <div id="detailedEquipmentDisplay">
                <div id="headCard" class="equipmentCard"></div>
                <div id="handsCard" class="equipmentCard"></div>
                <div id="bodyCard" class="equipmentCard"></div>
                <div id="footCard" class="equipmentCard"></div>
                <div id="orbCard" class="equipmentCard"></div>
                <div id="ropeCard" class="equipmentCard"></div>
            </div>
        </div>
    `;
    showDialog(editDialog);
}

function calculateStats(charObject) {
    const ascension = characterObjects[charObject.key].ascension[charObject.ascension];
    const stats = {};
    for (let key in ascension) {
        switch (key) {
            case "atk":
            case "def":
            case "hp":
                stats[key] = Math.floor(ascension[key].base + ascension[key].step * (charObject.level - 1));
                break;
            case "crit_rate":
            case "crit_dmg":
            case "spd":
                stats[key] = ascension[key].base;
                break;
        }
    }
    return stats;
}

function showDialog(div) {
    dialogContainer.style.visibility = "visible";
    div.style.display = "flex";
}

function closeDialog() {
    dialogContainer.style.visibility = "hidden";
    for (const child of dialogContainer.children) child.style.display = "none";
}

function addSpaces(name) {
    if (name === "DanHengIL") return "Dan Heng IL";
    for(let i = 1; i < name.length; i++) {
        if (name[i] === name[i].toUpperCase()) {
            name = name.substring(0, i) + " " + name.substring(i);
            i++;
        }
    }
    return name;
}

function sortCards(list) {
    const children = Array.from(list.children)
    children.sort((a,b) => {
        const idA = a.id.toUpperCase();
        const idB = b.id.toUpperCase();
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
    });
    children.forEach(child => list.appendChild(child));
}

fetchJSON();
initialize();