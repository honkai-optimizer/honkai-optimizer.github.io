const names = ['Acheron', 'Argenti', 'Arlan', 'Asta', 'Aventurine', 'Bailu', 'BlackSwan', 'Blade', 'Bronya', 'Clara', 'DanHeng', 'DanHengIL', 'DrRatio', 'FuXuan', 'Gallagher', 'Gepard', 'Guinaifen', 'Hanya', 'Herta', 'Himeko', 'Hook', 'Huohuo', 'JingYuan', 'Jingliu', 'Kafka', 'Luka', 'Luocha', 'Lynx', 'March7th', 'Misha', 'Natasha', 'Pela', 'Qingque', 'RuanMei', 'Sampo', 'Seele', 'Serval', 'SilverWolf', 'Sparkle', 'Sushang', 'Tingyun', 'TopazAndNumby', 'TrailblazerFire', 'TrailblazerPhysical', 'Welt', 'Xueyi', 'Yanqing', 'Yukong',];

const ownedCharList = document.getElementById("owned_character_list");
const createCharList = document.getElementById("create_character_list");
const dialogContainer = document.getElementById("dialog_container");
const addDialog = document.getElementById("add_character_dialog");
const editDialog = document.getElementById("edit_character_dialog");
const paths = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
const types = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
let paths_on_owned = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let types_on_owned = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
let paths_on_create = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let types_on_create = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
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
        if (e.target === dialogContainer) {
            closeDialog();
        }
    });
}

function addCharToCreateList(name) {
    const type = characterObjects[addSpaces(name)].element;
    const path = characterObjects[addSpaces(name)].path;
    const card = createDiv(["mini_card", "flex_col", characterObjects[addSpaces(name)].element, characterObjects[addSpaces(name)].path]);
    card.id = name;
    let withSpaces = addSpaces(name);
    const traceInfo = getTraceInfo(withSpaces);
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/chars/Codex Avatar_${withSpaces}.png" height="124px" width="112px">
            <div class="info_text flex_col">${withSpaces}</div>
        </div>
    `;
    createCharList.append(card);
    card.onclick = e => {
        localStorage.setItem("char_" + name, JSON.stringify({
            key: withSpaces,
            path: characterObjects[withSpaces].path,
            type: characterObjects[withSpaces].element,
            level: 1,
            ascension: 0,
            traces: {
                basic: 1,
                skill: 1,
                ultimate: 1,
                talent: 1,
                stats: [0,0,0,0,0,0,0,0,0,0],
                types: traceInfo[0],
                amounts: traceInfo[1],
                abilities: [0,0,0]
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
        addCharToOwnedList(name);
        card.remove();
    }
}

function addCharToOwnedList(name) {
    const val = JSON.parse(localStorage.getItem("char_" + name));
    const card = createDiv(["character_card", "flex_col", val.path, val.type]);
    card.id = name;
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(name)}.png" height="124px" width="112px">
            <div class="flex_col gap_10">
                <img src="./icons/path/path_${val.path}.png" height="24" width="24">
                <img src="./icons/type/Type_${val.type}.png" height="24" width="24">
            </div>
            <div class="infoText">
                <div>
                    <p>${val.key}<br><br>
                    Lvl. ${val.level} E${val.eidolon}</p>
                </div>
                <div class="card_traces">
                    <div class="trace_circle">${val.traces.basic}</div>
                    <div class="trace_circle">${val.traces.skill}</div>
                    <div class="trace_circle">${val.traces.ultimate}</div>
                    <div class="trace_circle">${val.traces.talent}</div>
                </div>
            </div>
        </div>
        <div class="equipment_display">
            <img src="./icons/lightcones/empty.png" height="38px" width="38px"><!-- light cone -->
            <img src="./icons/relic/Default/head.png" height="38px" width="38px"><!-- head -->
            <img src="./icons/relic/Default/hands.png" height="38px" width="38px"><!-- hands -->
            <img src="./icons/relic/Default/body.png" height="38px" width="38px"><!-- body -->
            <img src="./icons/relic/Default/foot.png" height="38px" width="38px"><!-- foot -->
            <img src="./icons/relic/Default/orb.png" height="38px" width="38px"><!-- orb -->
            <img src="./icons/relic/Default/rope.png" height="38px" width="38px"><!-- rope -->
        </div>
    `;
    card.onclick = e => {
        openCharacterInfo(card.id);
        toggleEidolons(card.id);
    } 
    ownedCharList.append(card);
    sortCards(ownedCharList);
}

function deleteCharacter(name) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
        localStorage.removeItem("char_" + name);
        document.getElementById(name).remove();
        addCharToCreateList(name);
        sortCards(createCharList);
        closeDialog();
    }
    //TODO: Remove character from relics and lightcone
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


function openCharacterInfo(name) {
    const charObject = JSON.parse(localStorage.getItem("char_" + name));
    const stats = calculateStats(charObject);
    const abilityInfo = getAbilityInfos(addSpaces(name));
    editDialog.innerHTML = /*HTML*/ `
        <button id="delete_character" type="button" class="no_text_wrap_overflow" onclick="deleteCharacter('${name}')">Delete Character</button>
        <div id="edit_info_container">
            <div id="edit_info_left_segment" class="flex_col">
                <div id="stat_container" class="flex_col">
                    <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(name)}.png" height="165px" width="149px">
                    <div id="level_container">
                        <div class="stat_text">Lvl. ${charObject.level}/${charObject.ascension * 10 + 20}</div>
                        <div id="level" class="dropdown_container">
                            <div class="dropdown_button" onclick="toggleLevelDropdown('${name}')">
                                <p>Select</p>
                                <i class="fa fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <div class="stat_text" id="HP">HP: ${stats.HP}</div>
                    <div class="stat_text" id="ATK">ATK: ${stats.ATK}</div>
                    <div class="stat_text" id="DEF">DEF: ${stats.DEF}</div>
                    <div class="stat_text" id="SPD">SPD: ${stats.SPD}</div>
                    <div class="stat_text" id="CRIT_RATE">CRIT RATE: ${stats.CRIT_RATE}</div>
                    <div class="stat_text" id="CRIT_DMG">CRIT DMG: ${stats.CRIT_DMG}</div>
                    <div class="stat_text" id="type_damage">Bonus ${charObject.type} DMG: ${stats.type_damage}%</div>
                    <div class="stat_text" id="effect_hr">Effect Hit Rate: ${stats.effect_hr}%</div>
                    <div class="stat_text" id="break_effect">Break Effect: ${stats.break_effect}%</div>
                    <div class="stat_text" id="energy_regeneration_rate">Energy Regeneration Rate: ${stats.energy_regeneration_rate}%</div>
                    <div class="stat_text" id="outgoing_healing">Bonus Outgoing Healing: ${stats.outgoing_healing}%</div>
                    <div class="stat_text" id="effect_res">Effect RES: ${stats.effect_res}%</div>
                </div>
                <div id="trace_container" class="flex_col">
                    <div id="major_trace_container" class="flex_col">
                        <div id="major_1" class="major_card">
                            <div class="card_title">
                                <img src="${abilityInfo[2][2][0]}" width="48px" height="48px">
                                <p>${abilityInfo[2][0][0]}</p>
                            </div>
                            <p>${abilityInfo[2][1][0]}</p>
                        </div>
                        <div id="major_2" class="major_card">
                            <div class="card_title">
                                <img src="${abilityInfo[2][2][1]}" width="48px" height="48px">
                                <p>${abilityInfo[2][0][1]}</p>
                            </div>
                            <p>${abilityInfo[2][1][1]}</p>
                        </div>
                        <div id="major_3" class="major_card">
                            <div class="card_title">
                                <img src="${abilityInfo[2][2][2]}" width="48px" height="48px">
                                <p>${abilityInfo[2][0][2]}</p>
                            </div>
                            <p>${abilityInfo[2][1][2]}</p>
                        </div>
                    </div>
                    <div id="minor_trace_container">
                        <div id="minor_1" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[0]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[0] * 100}%</p>
                        </div>
                        <div id="minor_2" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[1]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[1] * 100}%</p>
                        </div>
                        <div id="minor_3" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[2]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[2] * 100}%</p>
                        </div>
                        <div id="minor_4" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[3]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[3] * 100}%</p>
                        </div>
                        <div id="minor_5" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[4]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[4] * 100}%</p>
                        </div>
                        <div id="minor_6" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[5]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[5] * 100}%</p>
                        </div>
                        <div id="minor_7" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[6]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[6] * 100}%</p>
                        </div>
                        <div id="minor_8" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[7]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[7] * 100}%</p>
                        </div>
                        <div id="minor_9" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[8]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[8] * 100}%</p>
                        </div>
                        <div id="minor_10" class="minor_card">
                            <img src="./icons/stats/${charObject.traces.types[9]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[9] * 100}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="trace_equipment_display" class="flex_col">
                <div id="trace_edit">
                    <div id="basic" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleTraceDropdown('${name}', 'basic')">
                            <img src="${abilityInfo[1][0]}" width="32px" height="32px">
                            <p id="basic_text" class="no_text_wrap_overflow">Basic Lv. ${charObject.traces.basic}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    <div id="skill" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleTraceDropdown('${name}', 'skill')">
                            <img src="${abilityInfo[1][1]}" width="32px" height="32px">
                            <p id="skill_text" class="no_text_wrap_overflow">Skill Lv. ${charObject.traces.skill}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    <div id="ultimate" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleTraceDropdown('${name}', 'ultimate')">
                            <img src="${abilityInfo[1][2]}" width="32px" height="32px">
                            <p id="ultimate_text" class="no_text_wrap_overflow">Ultimate Lv. ${charObject.traces.ultimate}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    <div id="talent" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleTraceDropdown('${name}', 'talent')">
                            <img src="${abilityInfo[1][3]}" width="32px" height="32px">
                            <p id="talent_text" class="no_text_wrap_overflow">Talent Lv. ${charObject.traces.talent}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
                <div class="lightcone_card"></div>
                <div id="detailed_relic_display">
                    <div id="head_card" class="equipment_card flex_col"></div>
                    <div id="hands_card" class="equipment_card flex_col"></div>
                    <div id="body_card" class="equipment_card flex_col"></div>
                    <div id="foot_card" class="equipment_card flex_col"></div>
                    <div id="orb_card" class="equipment_card flex_col"></div>
                    <div id="rope_card" class="equipment_card flex_col"></div>
                </div>
                <div id="eidolon_display">
                    <div id="eidolon_1" class="eidolon_card flex_col" onclick="changeEidolon('${name}','1')">
                        <div class="card_title">
                            <img src="${abilityInfo[0][2][0]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][0]}</div>
                        </div>
                        <p>${abilityInfo[0][1][0]}</p>
                    </div>
                    <div id="eidolon_2" class="eidolon_card flex_col" onclick="changeEidolon('${name}','2')">
                        <div class="card_title">
                            <img src="${abilityInfo[0][2][1]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][1]}</div>
                        </div>
                        <p>${abilityInfo[0][1][1]}</p>
                    </div>
                    <div id="eidolon_3" class="eidolon_card flex_col" onclick="changeEidolon('${name}','3')">
                        <div class="card_title">
                            <img src="${abilityInfo[0][2][2]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][2]}</div>
                        </div>
                        <p>${abilityInfo[0][1][2]}</p>
                    </div>
                    <div id="eidolon_4" class="eidolon_card flex_col" onclick="changeEidolon('${name}','4')">
                        <div class="card_title">
                            <img src="${abilityInfo[0][2][3]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][3]}</div>
                        </div>
                        <p>${abilityInfo[0][1][3]}</p>
                    </div>
                    <div id="eidolon_5" class="eidolon_card flex_col" onclick="changeEidolon('${name}','5')">
                        <div class="card_title">
                            <img src="${abilityInfo[0][2][4]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][4]}</div>
                        </div>
                        <p>${abilityInfo[0][1][4]}</p>
                    </div>
                    <div id="eidolon_6" class="eidolon_card flex_col" onclick="changeEidolon('${name}','6')">
                        <div class="card_title">
                            <img src="${abilityInfo[0][2][5]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][5]}</div>
                        </div>
                        <p>${abilityInfo[0][1][5]}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    showDialog(editDialog);
}

function toggleLevelDropdown(name) {
    closeDropdown("level");
    let container = document.getElementById("level_container").querySelector(".dropdown_container");
    container.classList.toggle("open");
    let img = container.querySelector("i");
    img.classList.toggle("fa-chevron-up");
    img.classList.toggle("fa-chevron-down");
    if (!container.classList.contains("open")) {
        container.querySelector(".dropdown_menu").remove();
        return;
    }
    let menu = createDiv(["dropdown_menu", "flex_col"]);
    container.append(menu);
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    for (let i = 0; i <= 6; i++) {
        let option_1 = createDiv("dropdown_option");
        option_1.style.paddingInline = "5px";
        option_1.innerText = (i == 0 ? 1 : (i - 1) * 10 + 20) + "/" + (i * 10 + 20);
        option_1.onclick = e => updateLevel(name, option_1, i, container);
        let option_2 = createDiv("dropdown_option");
        option_2.style.paddingInline = "5px";
        option_2.innerText = (i * 10 + 20) + "/" + (i * 10 + 20);
        option_2.onclick = e => updateLevel(name, option_2, i, container);
        menu.append(option_1);
        menu.append(option_2);
    }
}

function updateLevel(name, option, ascension, container) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    let lvlText = option.innerText.split("/");
    obj.level = lvlText[0];
    obj.ascension = ascension;
    localStorage.setItem("char_" + name, JSON.stringify(obj));
    container.parentElement.querySelector(".stat_text").innerText = "Lvl. " + lvlText[0] + "/" + lvlText[1];
    toggleLevelDropdown(name);
    //TODO: Disable locked traces/lower trace levels
    updateCard(name);
    updateStats(obj);
}

function updateStats(obj) {
    const stats = calculateStats(obj);
    for (let key in stats) {
        document.getElementById(key).innerText = key.replace(/_/g, " ") +": " + stats[key];
    }
}

function updateCard(name) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    let infoText = document.getElementById(name).querySelector("p");
    let cardTraceChildren = document.getElementById(name).querySelector(".card_traces").children;
    let equipmentDisplay = document.getElementById(name).querySelector(".equipment_display");
    cardTraceChildren[0].innerText = obj.traces.basic;
    cardTraceChildren[1].innerText = obj.traces.skill;
    cardTraceChildren[2].innerText = obj.traces.ultimate;
    cardTraceChildren[3].innerText = obj.traces.talent;
    infoText.innerHTML = name + "<br><br>" + "Lvl. " + obj.level + " E" + obj.eidolon;
}

function toggleTraceDropdown(name, id) {
    closeDropdown(id);
    let container = document.getElementById(id);
    container.classList.toggle("open");
    let img = container.querySelector("i");
    img.classList.toggle("fa-chevron-up");
    img.classList.toggle("fa-chevron-down");
    if (!container.classList.contains("open")) {
        container.querySelector(".dropdown_menu").remove();
        return;
    }
    let menuLength = id == 'basic' ? 7 : 12;
    let maxLevel = getMaxTraceLevel(name, id);
    let menu = createDiv(["dropdown_menu", "flex_col"]);
    menu.style.position = "relative";
    container.append(menu);
    for (let i = 1; i <= menuLength; i++) {
        let option = createDiv("dropdown_option");
        option.innerText = "Level " + i;
        if (i <= maxLevel) {
            option.onclick = e => {
                let obj = JSON.parse(localStorage.getItem("char_" + name));
                obj.traces[id] = i;
                localStorage.setItem("char_" + name, JSON.stringify(obj));
                document.getElementById(id + "_text").innerText = (id.charAt(0).toUpperCase() + id.slice(1)) + " Lv. " + i;
                toggleTraceDropdown(name, id);
                updateCard(name);
            };
        } else {
            option.style.backgroundColor = "var(--custom-gray-purple)";
            option.style.color = "var(--textcolor-off)";
        }
        menu.append(option);
    }
}

function closeDropdown(id) {
    let parent = document.querySelector(".dropdown_menu")?.parentElement;
    if (parent && parent.id != id) {
        let img = parent.querySelector("i");
        swapChevron(img);
        parent.classList.toggle("open");
        parent.querySelector(".dropdown_menu").remove();
    }
}

function swapChevron(img) {
    img.classList.toggle("fa-chevron-up");
    img.classList.toggle("fa-chevron-down");
}

/**
 * Calculates the combat stats of the passed character based on their level, equipment, traces and any potentially active buffs from teammates.
 * @param {Object} obj The character whose stats are to be calculated. This should be an object from localStorage with the key "char_<name>", without spaces.
 * @returns An object containing all the relevant stats with the following keys:
 *          ATK, DEF, HP, SPD, CRIT RATE, CRIT DMG, type_damage, effect_hr, break_effect, energy_regeneration_rate, outgoing_healing, effect_res
 */
function calculateStats(obj) {
    const ascension = characterObjects[obj.key].ascension[obj.ascension];
    const stats = {};
    for (let key in ascension) {
        switch (key) {
            case "atk":
            case "def":
            case "hp":
                stats[key.toUpperCase()] = Math.floor(ascension[key].base + ascension[key].step * (obj.level - 1));
                break;
            case "crit_rate":
            case "crit_dmg":
            case "spd":
                stats[key.toUpperCase()] = ascension[key].base;
                break;
        }
    }
    return stats;
}

/**
 * Shows the dialog represented by the passed div element. It should be a child of the div dialog_container.
 * @param {HTMLDivElement} div The element to display. 
 */
function showDialog(div) {
    dialogContainer.style.visibility = "visible";
    div.style.display = "flex";
}

/**
 * Takes a string and adds spaces in front of every capital letter that isn't the first letter in the string.
 * @param {string} name The name to be formatted.
 * @returns 
 */
function addSpaces(name) {
    if (name === "DanHengIL") return "Dan Heng IL";
    for (let i = 1; i < name.length; i++) {
        if (name[i] === name[i].toUpperCase()) {
            name = name.substring(0, i) + " " + name.substring(i);
            i++;
        }
    }
    return name;
}

/**
 * Sorts all the character cards within the passed list alphabetically in ascending order (e.g. from A to Z).
 * @param {HTMLDivElement} list The div element containing the cards to sort.
 */
function sortCards(list) {
    const children = Array.from(list.children)
    children.sort((a, b) => {
        const idA = a.id.toUpperCase();
        const idB = b.id.toUpperCase();
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
    });
    children.forEach(child => list.appendChild(child));
}

/**
 * Toggles the filter buttons.
 * If every button in the clicked button's group is on, every other button in the group gets turned off.
 * If toggling the clicked button off would leave the entire group turned off, it turns the whole group (including the clicked button) on.
 * In all other cases, simply switches the button on or off as expected.
 * @param {string} list The list this filter button applies to - pass 'owned' to specify the list of owned characters, and 'create' for the list of creatable characters.
 * @param {string} btn This argument should be the type or path that the button represents, with the first letter capitalized (for example 'Erudition').
 */
function toggleButtonClick(list, btn) {
    if (types.includes(btn) && list == 'owned') {
        let buttons = document.getElementById("button_wrapper").querySelectorAll(".type_button");
        if (types.length == types_on_owned.length) {
            types_on_owned = [btn];
            buttons.forEach(button => {
                if (!button.classList.contains(btn)) {
                    button.classList.remove("on");
                    button.classList.add("off");
                } else {
                    button.classList.remove("off");
                    button.classList.add("on");
                }
            });
        } else {
            if (types_on_owned.includes(btn)) {
                types_on_owned.splice(types_on_owned.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (types_on_owned.length == 0) {
                    types_on_owned = types;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                types_on_owned.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    } else if (paths.includes(btn) && list == 'owned') {
        let buttons = document.getElementById("button_wrapper").querySelectorAll(".path_button");
        if (paths.length == paths_on_owned.length) {
            paths_on_owned = [btn];
            buttons.forEach(button => {
                if (!button.classList.contains(btn)) {
                    button.classList.remove("on");
                    button.classList.add("off");
                } else {
                    button.classList.remove("off");
                    button.classList.add("on");
                }
            })
        } else {
            if (paths_on_owned.includes(btn)) {
                paths_on_owned.splice(paths_on_owned.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (paths_on_owned.length == 0) {
                    paths_on_owned = paths;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                paths_on_owned.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    } else if (types.includes(btn)) {
        let buttons = addDialog.querySelectorAll(".type_button");
        if (types.length == types_on_create.length) {
            types_on_create = [btn];
            buttons.forEach(button => {
                if (!button.classList.contains(btn)) {
                    button.classList.remove("on");
                    button.classList.add("off");
                } else {
                    button.classList.remove("off");
                    button.classList.add("on");
                }
            });
        } else {
            if (types_on_create.includes(btn)) {
                types_on_create.splice(types_on_create.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (types_on_create.length == 0) {
                    types_on_create = types;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                types_on_create.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    } else {
        let buttons = addDialog.querySelectorAll(".path_button");
        if (paths.length == paths_on_create.length) {
            paths_on_create = [btn];
            buttons.forEach(button => {
                if (!button.classList.contains(btn)) {
                    button.classList.remove("on");
                    button.classList.add("off");
                } else {
                    button.classList.remove("off");
                    button.classList.add("on");
                }
            })
        } else {
            if (paths_on_create.includes(btn)) {
                paths_on_create.splice(paths_on_create.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (paths_on_create.length == 0) {
                    paths_on_create = paths;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                paths_on_create.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    }
    applyFilter(list);
}

/**
 * Applies the specified list's filter to that list.
 * @param {string} list The list the filter applies to - pass 'owned' to specify the list of owned characters, and 'create' for the list of creatable characters.
 */
function applyFilter(list) {
    let show_type = [];
    let show_path = [];
    let show_both = [];
    let cards;
    if (list == 'owned') {
        cards = ownedCharList.querySelectorAll(".character_card");
        cards.forEach(character => {
            types_on_owned.forEach(type => {
                if (character.classList.contains(type)) show_type.push(character);
            });
        });
        cards.forEach(character => {
            paths_on_owned.forEach(path => {
                if (character.classList.contains(path)) show_path.push(character);
            });
        });
        show_type.forEach(character => {
            if (show_path.includes(character)) show_both.push(character);
        })
        cards.forEach(character => {
            character.style.display = show_both.includes(character) ? "flex" : "none";
        });
    }
    else {
        cards = createCharList.querySelectorAll(".mini_card");
        cards.forEach(character => {
            types_on_create.forEach(type => {
                if (character.classList.contains(type)) show_type.push(character);
            });
        });
        cards.forEach(character => {
            paths_on_create.forEach(path => {
                if (character.classList.contains(path)) show_path.push(character);
            });
        });
        show_type.forEach(character => {
            if (show_path.includes(character)) show_both.push(character);
        })
        cards.forEach(character => {
            character.style.display = show_both.includes(character) ? "flex" : "none";
        });
    }
}

/**
 * Closes any dialog and resets the filter on the list of characters in the creation dialog.
 */
function closeDialog() {
    dialogContainer.style.visibility = "hidden";
    for (const child of dialogContainer.children) child.style.display = "none";
    addDialog.querySelectorAll(".path_button, .type_button").forEach(button => {
        button.classList.add("on");
        button.classList.remove("off");
    });
    paths_on_create = paths;
    types_on_create = types;
    applyFilter('create');
}

/**
 * Creates a div element and adds CSS class(es) to the class list.
 * @param {(string | string[])} arr A string or array of strings representing css class(es) to be added to the class list.
 * @returns the styled div
 */
function createDiv(arr) {
    const div = document.createElement("div")
    if (arr.constructor === Array) div.classList.add(...arr);
    else div.classList.add(arr);
    return div;
}

/**
 * Gets a character's eidolon names, descriptions and icons, ability icons and major trace icons and descriptions, then returns them in an array.
 * @param {string} name The name of the character with spaces.
 * @returns The data array. [0][0][i] is the name, [0][1][i] the description and [0][2][i] the icon path of the (i+1)-th eidolon.
 * The [1] array holds the basic, skill, ultimate and talenticon path in that order.
 * The [2][0] array holds the major trace descriptions, the [2][1] array holds their icon paths.
 */
function getAbilityInfos(name) {
    let arr = [[[],[],[]],[],[[],[],[]]];
    for(let i = 0; i <= 5; i++) {
        arr[0][0].push(characterObjects[name].eidolons[i].name);
        arr[0][1].push(characterObjects[name].eidolons[i].desc);
        arr[0][2].push(characterObjects[name].eidolons[i].icon);
    }
    let skills = characterObjects[name].skills;
    let traces = characterObjects[name].traces;
    arr[1].push(Array.isArray(skills['basic']) ? skills['basic'][0].icon : skills['basic'].icon);
    arr[1].push(Array.isArray(skills['skill']) ? skills['skill'][0].icon : skills['skill'].icon);
    arr[1].push(Array.isArray(skills['ult']) ? skills['ult'][0].icon : skills['ult'].icon);
    arr[1].push(Array.isArray(skills['talent']) ? skills['talent'][0].icon : skills['talent'].icon);
    for(let i = 1; i <= 3; i++) {
        arr[2][0].push(traces["ability_"+i].name);
        arr[2][1].push(traces["ability_"+i].desc);
        arr[2][2].push(traces["ability_"+i].icon);
    }
    return arr;
}

function getTraceInfo(name) {
    let arr = [[],[]];
    for(let i = 1; i <= 10; i++) {
        arr[0].push(characterObjects[name].traces["stat_"+i].modifiers[0].type);
        arr[1].push(characterObjects[name].traces["stat_"+i].modifiers[0].value);
    }
    return arr;
}

function getMaxTraceLevel(name, id) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    let e3 = characterObjects[addSpaces(name)].eidolons[2].level_up_skills;
    let e5 = characterObjects[addSpaces(name)].eidolons[4].level_up_skills;
    let max = 1;
    switch (id) {
        case "basic":
            if (e3.hasOwnProperty('basic') && obj.eidolon >= 3 || obj.eidolon >= 5) max++;
            return obj.ascension < 2 ? max : obj.ascension;
        case "skill":
            if (e3.hasOwnProperty('skill') && obj.eidolon >= 3 || obj.eidolon >= 5) max = max + 2;
            return obj.ascension <= 3 ? obj.ascension + max : max + obj.ascension + obj.ascension - 3;
        case "ultimate":
            if (e3.hasOwnProperty('ultimate') && obj.eidolon >= 3 || obj.eidolon >= 5) max = max + 2;
            return obj.ascension <= 3 ? obj.ascension + max : max + obj.ascension + obj.ascension - 3;
        case "talent":
            if (e3.hasOwnProperty('talent') && obj.eidolon >= 3 || obj.eidolon >= 5) max = max + 2;
            return obj.ascension <= 3 ? obj.ascension + max : max + obj.ascension + obj.ascension - 3;
    }
}

function toggleEidolons(name) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    for (let i = 1; i <= 6; i++) {
        if(i > obj.eidolon)
            document.getElementById("eidolon_" + i).classList.add("off");
        else
            document.getElementById("eidolon_" + i).classList.remove("off");
    }
    updateCard(name);
}

function toggleTraces(name) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    if (obj.ascension > 1)

    switch(obj.path) {
        case "Nihility":
        case "Abundance":
        case "Erudition":
        case "Destruction":
        case "Hunt":
        case "Preservation":
        case "Harmony":
}
}

function changeEidolon(name, val) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    if (obj.eidolon == val) obj.eidolon = val - 1;
    else obj.eidolon = +val;
    localStorage.setItem("char_" + name, JSON.stringify(obj));
    toggleEidolons(name);
}

/**
 * Waits for the JSON files to be fetched and then initializes the website.
 */
async function boot() {
    await fetchJSON();
    initialize();
}

boot();