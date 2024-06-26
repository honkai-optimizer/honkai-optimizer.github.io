const names = ['Acheron', 'Argenti', 'Arlan', 'Asta', 'Aventurine', 'Bailu', 'BlackSwan', 'Blade', 'Bronya', 'Clara', 'DanHeng', 'DanHengIL', 'DrRatio', 'FuXuan', 'Gallagher', 'Gepard', 'Guinaifen', 'Hanya', 'Herta', 'Himeko', 'Hook', 'Huohuo', 'JingYuan', 'Jingliu', 'Kafka', 'Luka', 'Luocha', 'Lynx', 'March7th', 'Misha', 'Natasha', 'Pela', 'Qingque', 'RuanMei', 'Sampo', 'Seele', 'Serval', 'SilverWolf', 'Sparkle', 'Sushang', 'Tingyun', 'TopazAndNumby', 'TrailblazerFire', 'TrailblazerPhysical', 'Welt', 'Xueyi', 'Yanqing', 'Yukong',];

const ownedCharList = document.getElementById("owned_character_list");
const createCharList = document.getElementById("create_character_list");
const dialogContainerChar = document.getElementById("dialog_container");
const addDialog = document.getElementById("add_character_dialog");
const editDialog = document.getElementById("edit_character_dialog");
const pathsChar = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
const typesChar = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
let pathsOnOwnedChar = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let typesOnOwnedChar = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
let pathsOnCreateChar = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let typesOnCreateChar = ['Fire', 'Ice', 'Imaginary', 'Lightning', 'Physical', 'Quantum', 'Wind'];
let characterObjects;
let relicRolls;
let relicStats;
let relicSets;
let lightCones;

async function fetchCharJSON() {
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

function initializeChar() {
    names.forEach(name => {
        const val = localStorage.getItem("char_" + name);
        if (val != null) addCharToOwnedList(name)
        else addCharToCreateList(name);
    });
    dialogContainerChar.addEventListener("click", e => {
        if (e.target === dialogContainerChar) {
            closeDialogChar();
        }
    });
}

function addCharToCreateList(name) {
    let withSpaces = addSpaces(name);
    const type = characterObjects[withSpaces].element;
    const path = characterObjects[withSpaces].path;
    const card = createDiv(["mini", "card", "flex_col", characterObjects[withSpaces].element, characterObjects[withSpaces].path]);
    card.id = name;
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
                stats: [false, false, false, false, false, false, false, false, false, false],
                types: traceInfo[0],
                amounts: traceInfo[1],
                abilities: [false, false, false]
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
        closeDialogChar();
        addCharToOwnedList(name);
        card.remove();
    }
}

function addCharToOwnedList(name) {
    const val = JSON.parse(localStorage.getItem("char_" + name));
    const card = createDiv(["character", "card", "flex_col", val.path, val.type]);
    card.id = name;
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(name)}.png" height="124px" width="112px">
            <div class="flex_col gap_10">
                <img src="./icons/path/path_${val.path}.png" height="24" width="24">
                <img src="./icons/type/Type_${val.type}.png" height="24" width="24">
            </div>
            <div class="info_text">
                <div>
                    <p>${val.key}<br>
                    Lvl. ${val.level} E${val.eidolon}</p>
                </div>
                <img src="./icons/rarity/${characterObjects[addSpaces(name)].rarity}.png" height="30px" width="128px">
                <div class="card traces">
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
        toggleTraces(card.id);
    } 
    ownedCharList.append(card);
    applyFilterChar('owned');
    sortCards(ownedCharList);
}

function deleteCharacter(name) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
        localStorage.removeItem("char_" + name);
        document.getElementById(name).remove();
        addCharToCreateList(name);
        sortCards(createCharList);
        closeDialogChar();
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
    //TODO: Remove characters from relics and lightcones
}


function openCharacterInfo(name) {
    const charObject = JSON.parse(localStorage.getItem("char_" + name));
    const stats = calculateCharStats(charObject);
    const abilityInfo = getAbilityInfos(addSpaces(name));
    editDialog.innerHTML = /*HTML*/ `
        <button id="delete_character" type="button" class="no_text_wrap_overflow delete" onclick="deleteCharacter('${name}')">Delete Character</button>
        <div id="edit_info_container">
            <div id="edit_info_left_segment" class="flex_col">
                <div id="stat_container" class="flex_col">
                    <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(name)}.png" height="165px" width="149px">
                    <div id="level_container">
                        <div class="stat_text">Lvl. ${charObject.level}/${charObject.ascension * 10 + 20}</div>
                        <div id="level" class="dropdown_container">
                            <div class="dropdown_button" onclick="toggleCharLevelDropdown('${name}')">
                                <p>Select</p>
                                <i class="fa fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <div class="stat_text" id="HP">
                        <img src="./icons/stats/hp.png" height="24px" width="24px">
                        HP: ${stats.HP}
                    </div>
                    <div class="stat_text" id="ATK">
                    <img src="./icons/stats/atk.png" height="24px" width="24px">
                        ATK: ${stats.ATK}
                    </div>
                    <div class="stat_text" id="DEF">
                    <img src="./icons/stats/def.png" height="24px" width="24px">
                        DEF: ${stats.DEF}
                    </div>
                    <div class="stat_text" id="SPD">
                    <img src="./icons/stats/spd.png" height="24px" width="24px">
                        SPD: ${stats.SPD}
                    </div>
                    <div class="stat_text" id="CRIT_RATE">
                    <img src="./icons/stats/crit_rate.png" height="24px" width="24px">
                        CRIT RATE: ${stats.CRIT_RATE}
                    </div>
                    <div class="stat_text" id="CRIT_DMG">
                    <img src="./icons/stats/crit_dmg.png" height="24px" width="24px">
                        CRIT DMG: ${stats.CRIT_DMG}
                    </div>
                    <div class="stat_text" id="type_damage">
                    <img src="./icons/stats/${charObject.type}.png" height="24px" width="24px">
                        Bonus ${charObject.type} DMG: ${stats.type_damage}%
                    </div>
                    <div class="stat_text" id="effect_hr">
                    <img src="./icons/stats/effect_hit.png" height="24px" width="24px">
                        Effect Hit Rate: ${stats.effect_hr}%
                    </div>
                    <div class="stat_text" id="break_effect">
                    <img src="./icons/stats/break.png" height="24px" width="24px">
                        Break Effect: ${stats.break_effect}%
                    </div>
                    <div class="stat_text" id="energy_regeneration_rate">
                    <img src="./icons/stats/energy_regeneration.png" height="24px" width="24px">
                        Energy Regeneration Rate: ${stats.energy_regeneration_rate}%
                    </div>
                    <div class="stat_text" id="outgoing_healing">
                    <img src="./icons/stats/outgoing_healing.png" height="24px" width="24px">
                        Bonus Outgoing Healing: ${stats.outgoing_healing}%
                    </div>
                    <div class="stat_text" id="effect_res">
                    <img src="./icons/stats/effect_res.png" height="24px" width="24px">
                        Effect RES: ${stats.effect_res}%
                    </div>
                </div>
                <div id="trace_container" class="flex_col">
                    <div id="major_trace_container" class="flex_col">
                        <div id="major_1" class="major card">
                            <div class="card title">
                                <img src="${abilityInfo[2][2][0]}" width="48px" height="48px">
                                <p>${abilityInfo[2][0][0]}</p>
                            </div>
                            <p>${abilityInfo[2][1][0]}</p>
                        </div>
                        <div id="major_2" class="major card">
                            <div class="card title">
                                <img src="${abilityInfo[2][2][1]}" width="48px" height="48px">
                                <p>${abilityInfo[2][0][1]}</p>
                            </div>
                            <p>${abilityInfo[2][1][1]}</p>
                        </div>
                        <div id="major_3" class="major card">
                            <div class="card title">
                                <img src="${abilityInfo[2][2][2]}" width="48px" height="48px">
                                <p>${abilityInfo[2][0][2]}</p>
                            </div>
                            <p>${abilityInfo[2][1][2]}</p>
                        </div>
                    </div>
                    <div id="minor_trace_container">
                        <div id="minor_1" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[0]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[0] * 100}%</p>
                        </div>
                        <div id="minor_2" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[1]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[1] * 100}%</p>
                        </div>
                        <div id="minor_3" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[2]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[2] * 100}%</p>
                        </div>
                        <div id="minor_4" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[3]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[3] * 100}%</p>
                        </div>
                        <div id="minor_5" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[4]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[4] * 100}%</p>
                        </div>
                        <div id="minor_6" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[5]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[5] * 100}%</p>
                        </div>
                        <div id="minor_7" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[6]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[6] * 100}%</p>
                        </div>
                        <div id="minor_8" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[7]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[7] * 100}%</p>
                        </div>
                        <div id="minor_9" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[8]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[8] * 100}%</p>
                        </div>
                        <div id="minor_10" class="minor card">
                            <img src="./icons/stats/${charObject.traces.types[9]}.png" width="32px" height="32px">
                            <p>+${charObject.traces.amounts[9] * 100}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="trace_equipment_display" class="flex_col">
                <div id="trace_edit">
                    <div id="basic" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleSkillDropdown('${name}', 'basic')">
                            <img src="${abilityInfo[1][0]}" width="32px" height="32px">
                            <p id="basic_text" class="no_text_wrap_overflow">Basic Lv. ${charObject.traces.basic}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    <div id="skill" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleSkillDropdown('${name}', 'skill')">
                            <img src="${abilityInfo[1][1]}" width="32px" height="32px">
                            <p id="skill_text" class="no_text_wrap_overflow">Skill Lv. ${charObject.traces.skill}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    <div id="ultimate" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleSkillDropdown('${name}', 'ultimate')">
                            <img src="${abilityInfo[1][2]}" width="32px" height="32px">
                            <p id="ultimate_text" class="no_text_wrap_overflow">Ultimate Lv. ${charObject.traces.ultimate}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    <div id="talent" class="dropdown_container">
                        <div class="dropdown_button" onclick="toggleSkillDropdown('${name}', 'talent')">
                            <img src="${abilityInfo[1][3]}" width="32px" height="32px">
                            <p id="talent_text" class="no_text_wrap_overflow">Talent Lv. ${charObject.traces.talent}</p>
                            <i class="fa fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
                <div class="lightcone card"></div>
                <div id="detailed_relic_display">
                    <div id="head_card" class="equipment card flex_col"></div>
                    <div id="hands_card" class="equipment card flex_col"></div>
                    <div id="body_card" class="equipment card flex_col"></div>
                    <div id="foot_card" class="equipment card flex_col"></div>
                    <div id="orb_card" class="equipment card flex_col"></div>
                    <div id="rope_card" class="equipment card flex_col"></div>
                </div>
                <div id="eidolon_display">
                    <div id="eidolon_1" class="eidolon card flex_col" onclick="changeEidolon('${name}','1')">
                        <div class="card title">
                            <img src="${abilityInfo[0][2][0]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][0]}</div>
                        </div>
                        <p>${abilityInfo[0][1][0]}</p>
                    </div>
                    <div id="eidolon_2" class="eidolon card flex_col" onclick="changeEidolon('${name}','2')">
                        <div class="card title">
                            <img src="${abilityInfo[0][2][1]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][1]}</div>
                        </div>
                        <p>${abilityInfo[0][1][1]}</p>
                    </div>
                    <div id="eidolon_3" class="eidolon card flex_col" onclick="changeEidolon('${name}','3')">
                        <div class="card title">
                            <img src="${abilityInfo[0][2][2]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][2]}</div>
                        </div>
                        <p>${abilityInfo[0][1][2]}</p>
                    </div>
                    <div id="eidolon_4" class="eidolon card flex_col" onclick="changeEidolon('${name}','4')">
                        <div class="card title">
                            <img src="${abilityInfo[0][2][3]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][3]}</div>
                        </div>
                        <p>${abilityInfo[0][1][3]}</p>
                    </div>
                    <div id="eidolon_5" class="eidolon card flex_col" onclick="changeEidolon('${name}','5')">
                        <div class="card title">
                            <img src="${abilityInfo[0][2][4]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][4]}</div>
                        </div>
                        <p>${abilityInfo[0][1][4]}</p>
                    </div>
                    <div id="eidolon_6" class="eidolon card flex_col" onclick="changeEidolon('${name}','6')">
                        <div class="card title">
                            <img src="${abilityInfo[0][2][5]}" width="48px" height="48px">
                            <div class="statText">${abilityInfo[0][0][5]}</div>
                        </div>
                        <p>${abilityInfo[0][1][5]}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    showCharDialog(editDialog);
}

function toggleCharLevelDropdown(name) {
    closeDropdown("level");
    let container = document.getElementById("level_container").querySelector(".dropdown_container");
    container.classList.toggle("open");
    let img = container.querySelector("i");
    swapChevron(img);
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
        option_1.onclick = e => updateCharLevel(name, option_1, i, container);
        let option_2 = createDiv("dropdown_option");
        option_2.style.paddingInline = "5px";
        option_2.innerText = (i * 10 + 20) + "/" + (i * 10 + 20);
        option_2.onclick = e => updateCharLevel(name, option_2, i, container);
        menu.append(option_1);
        menu.append(option_2);
    }
}

function updateCharLevel(name, option, ascension, container) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    let lvlText = option.innerText.split("/");
    obj.level = lvlText[0];
    obj.ascension = ascension;
    localStorage.setItem("char_" + name, JSON.stringify(obj));
    container.parentElement.querySelector(".stat_text").innerText = "Lvl. " + lvlText[0] + "/" + lvlText[1];
    toggleCharLevelDropdown(name);
    toggleTraces(name);
    updateCharCard(name);
    updateCharStats(obj);
}

function updateCharStats(obj) {
    const stats = calculateCharStats(obj);
    for (let key in stats) {
        document.getElementById(key).innerText = key.replace(/_/g, " ") +": " + stats[key];
    }
}

function updateCharCard(name) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    let infoText = document.getElementById(name).querySelector("p");
    let cardTraceChildren = document.getElementById(name).querySelector(".card.traces").children;
    let equipmentDisplay = document.getElementById(name).querySelector(".equipment_display");
    cardTraceChildren[0].innerText = obj.traces.basic;
    cardTraceChildren[1].innerText = obj.traces.skill;
    cardTraceChildren[2].innerText = obj.traces.ultimate;
    cardTraceChildren[3].innerText = obj.traces.talent;
    infoText.innerHTML = name + "<br>" + "Lvl. " + obj.level + " E" + obj.eidolon;
}

function toggleSkillDropdown(name, id) {
    closeDropdown(id);
    let container = document.getElementById(id);
    container.classList.toggle("open");
    let img = container.querySelector("i");
    swapChevron(img);
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
                toggleSkillDropdown(name, id);
                updateCharCard(name);
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
function calculateCharStats(obj) {
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
function showCharDialog(div) {
    dialogContainerChar.style.visibility = "visible";
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
function toggleButtonClickChar(list, btn) {
    if (typesChar.includes(btn) && list == 'owned') {
        let buttons = document.getElementById("button_wrapper").querySelectorAll(".filter_button.Fire, .filter_button.Ice, .filter_button.Lightning, .filter_button.Imaginary, .filter_button.Quantum, .filter_button.Physical, .filter_button.Wind");
        if (typesChar.length == typesOnOwnedChar.length) {
            typesOnOwnedChar = [btn];
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
            if (typesOnOwnedChar.includes(btn)) {
                typesOnOwnedChar.splice(typesOnOwnedChar.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (typesOnOwnedChar.length == 0) {
                    typesOnOwnedChar = typesChar;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                typesOnOwnedChar.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    } else if (pathsChar.includes(btn) && list == 'owned') {
        let buttons = document.getElementById("button_wrapper").querySelectorAll(".filter_button.Abundance, .filter_button.Erudition, .filter_button.Nihility, .filter_button.Preservation, .filter_button.Harmony, .filter_button.Destruction, .filter_button.Hunt");
        if (pathsChar.length == pathsOnOwnedChar.length) {
            pathsOnOwnedChar = [btn];
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
            if (pathsOnOwnedChar.includes(btn)) {
                pathsOnOwnedChar.splice(pathsOnOwnedChar.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (pathsOnOwnedChar.length == 0) {
                    pathsOnOwnedChar = pathsChar;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                pathsOnOwnedChar.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    } else if (typesChar.includes(btn)) {
        let buttons = addDialog.querySelectorAll(".filter_button.Fire, .filter_button.Ice, .filter_button.Lightning, .filter_button.Imaginary, .filter_button.Quantum, .filter_button.Physical, .filter_button.Wind");
        if (typesChar.length == typesOnCreateChar.length) {
            typesOnCreateChar = [btn];
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
            if (typesOnCreateChar.includes(btn)) {
                typesOnCreateChar.splice(typesOnCreateChar.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (typesOnCreateChar.length == 0) {
                    typesOnCreateChar = typesChar;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                typesOnCreateChar.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    } else {
        let buttons = addDialog.querySelectorAll(".filter_button.Abundance, .filter_button.Erudition, .filter_button.Nihility, .filter_button.Preservation, .filter_button.Harmony, .filter_button.Destruction, .filter_button.Hunt");
        if (pathsChar.length == pathsOnCreateChar.length) {
            pathsOnCreateChar = [btn];
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
            if (pathsOnCreateChar.includes(btn)) {
                pathsOnCreateChar.splice(pathsOnCreateChar.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (pathsOnCreateChar.length == 0) {
                    pathsOnCreateChar = pathsChar;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                pathsOnCreateChar.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    }
    applyFilterChar(list);
}

/**
 * Applies the specified list's filter to that list.
 * @param {string} list The list the filter applies to - pass 'owned' to specify the list of owned characters, and 'create' for the list of creatable characters.
 */
function applyFilterChar(list) {
    let show_type = [];
    let show_path = [];
    let show_both = [];
    let cards;
    if (list == 'owned') {
        cards = ownedCharList.querySelectorAll(".character.card");
        cards.forEach(character => {
            typesOnOwnedChar.forEach(type => {
                if (character.classList.contains(type)) show_type.push(character);
            });
        });
        cards.forEach(character => {
            pathsOnOwnedChar.forEach(path => {
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
        cards = createCharList.querySelectorAll(".mini.card");
        cards.forEach(character => {
            typesOnCreateChar.forEach(type => {
                if (character.classList.contains(type)) show_type.push(character);
            });
        });
        cards.forEach(character => {
            pathsOnCreateChar.forEach(path => {
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
function closeDialogChar() {
    dialogContainerChar.style.visibility = "hidden";
    for (const child of dialogContainerChar.children) child.style.display = "none";
    addDialog.querySelectorAll(".path_button, .type_button").forEach(button => {
        button.classList.add("on");
        button.classList.remove("off");
    });
    pathsOnCreateChar = pathsChar;
    typesOnCreateChar = typesChar;
    applyFilterChar('create');
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
    updateCharCard(name);
}

function toggleTraces(name) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    let unlockedMinor;
    let unlockedMajor;
    switch(obj.ascension) {
        case 0:
            unlockedMinor = 1;
            break;
        case 1:
            unlockedMinor = obj.ascension;
            break;
        case 2:
            unlockedMinor = obj.ascension;
            unlockedMajor = 1;
            break;
        case 3:
            unlockedMinor = obj.ascension + 1;
            unlockedMajor = 1;
            break;
        case 4:
            unlockedMinor = obj.ascension + 1;
            unlockedMajor = 2;
            break;
        case 5:
            unlockedMinor = 7;
            unlockedMajor = 1;
            break;
        case 6:
            unlockedMinor = obj.level < 75 ? 8 : obj.level < 80 ? 9 : 10;
            unlockedMajor = 3;
            break;
    }
    for (let i = 1; i <= 10; i++) {
        let button = document.getElementById("minor_" + i)
        if (i <= unlockedMinor) {
            button.classList.remove("locked");
            button.classList.add("off");
            button.onclick = e => toggleTrace(name, "minor", i);
        }
        else {
            obj.traces.stats[i-1] = false;
            button.classList.add("locked");
            button.onclick = null;
        }
    }
    for (let i = 1; i <= 3; i++) {
        let button = document.getElementById("major_" + i);
        if (i <= unlockedMajor) {
            button.classList.remove("locked");
            button.classList.add("off");
            button.onclick = e => toggleTrace(name, "major", i);
        }
        else {
            obj.traces.abilities[i-1] = false;
            button.classList.add("locked");
            button.onclick = null;
        }
    }
    localStorage.setItem("char_" + name, JSON.stringify(obj));
}

function toggleTrace(name, type, i) {
    let obj = JSON.parse(localStorage.getItem("char_" + name));
    if (type == "major") obj.traces.abilities[i-1] = !obj.traces.abilities[i-1];
    else obj.traces.stats[i-1] = !obj.traces.stats[i-1];
    localStorage.setItem("char_" + name, JSON.stringify(obj));
    document.getElementById(type + "_" + i).classList.toggle("off");
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
async function bootChar() {
    await fetchCharJSON();
    initializeChar();
}

bootChar();