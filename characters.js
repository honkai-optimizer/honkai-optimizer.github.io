"useStrict";

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

function addCharToCreateList(character) {
    const type = characterObjects[addSpaces(character)].element;
    const path = characterObjects[addSpaces(character)].path;
    const card = createDiv(["mini_card", "flex_col", characterObjects[addSpaces(character)].element, characterObjects[addSpaces(character)].path]);
    card.id = character;
    let withSpaces = addSpaces(character);
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/chars/Codex Avatar_${withSpaces}.png" height="124px" width="112px">
            <div class="info_text flex_col">${withSpaces}</div>
        </div>
    `;
    createCharList.append(card);
    card.onclick = e => {
        localStorage.setItem("char_" + character, JSON.stringify({
            key: withSpaces,
            path: characterObjects[withSpaces].path,
            type: characterObjects[withSpaces].element,
            level: 1,
            ascension: 0,
            traces: {
                basic: 1,
                skill: 1,
                ultimate: 1,
                stats: [0,0,0,0,0,0,0,0,0,0],
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
        addCharToOwnedList(character);
        card.remove();
    }
}

function addCharToOwnedList(character) {
    const val = JSON.parse(localStorage.getItem("char_" + character));
    const card = createDiv(["character_card", "flex_col", val.path, val.type]);
    card.id = character;
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(character)}.png" height="124px" width="112px">
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
    card.onclick = e => openCharacterInfo(card.id);
    ownedCharList.append(card);
    sortCards(ownedCharList);
}

function deleteCharacter(character) {
    console.log(character);
    if (confirm("Are you sure you want to delete " + character + "?")) {
        localStorage.removeItem("char_" + character);
        document.getElementById(character).remove();
        addCharToCreateList(character);
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


function openCharacterInfo(character) {
    const charObject = JSON.parse(localStorage.getItem("char_" + character));
    const stats = calculateStats(charObject);
    const abilityNames = getAbilityNames(addSpaces(character));
    for (let i = 0; i < abilityNames.length; i++)
        abilityNames[i] = abilityNames[i].replace(/ /g, "_");
    editDialog.innerHTML = /*HTML*/ `
        <button id="delete_character" type="button" class="no_text_wrap_overflow" onclick="deleteCharacter('${character}')">Delete Character</button>
        <div id="edit_info_container">
            <div id="stat_container" class="flex_col">
                <img class="portrait" src="./icons/chars/Codex Avatar_${addSpaces(character)}.png" height="165px" width="149px">
                <div class="stat_text" id="hp">HP: ${stats.hp}</div>
                <div class="stat_text" id="atk">ATK: ${stats.atk}</div>
                <div class="stat_text" id="def">DEF: ${stats.def}</div>
                <div class="stat_text" id="spd">SPD: ${stats.spd}</div>
                <div class="stat_text" id="crit_rate">Crit Rate: ${stats.crit_rate}</div>
                <div class="stat_text" id="crit_dmg">Crit DMG: ${stats.crit_dmg}</div>
                <div class="stat_text" id="type_damage">Bonus ${charObject.type} DMG: ${stats.type_damage}%</div>
                <div class="stat_text" id="effect_hr">Effect Hit Rate: ${stats.effect_hr}%</div>
                <div class="stat_text" id="break_effect">Break Effect: ${stats.break_effect}%</div>
                <div class="stat_text" id="energy_regeneration_rate">Energy Regeneration Rate: ${stats.energy_regeneration_rate}%</div>
                <div class="stat_text" id="outgoing_healing">Bonus Outgoing Healing: ${stats.outgoing_healing}%</div>
                <div class="stat_text" id="effect_res">Effect RES: ${stats.effect_res}%</div>
            </div>
            <div id="trace_equipment_display" class="flex_col">
                <div id="trace_edit">
                    <div id="basic" class="dropdown_button">
                        <img src="./icons/abilities/Ability_${abilityNames[0]}.png" width="32px" height="32px">
                        <p class="no_text_wrap_overflow">Basic Lv. ${charObject.traces.basic}</p>
                        <img src="./assets/down_arrow.png" width="16px" height="16px">
                    </div>
                    <div id="skill" class="dropdown_button">
                        <img src="./icons/abilities/Ability_${abilityNames[1]}.png" width="32px" height="32px">
                        <p class="no_text_wrap_overflow">Skill Lv. ${charObject.traces.skill}</p>
                        <img src="./assets/down_arrow.png" width="16px" height="16px">
                    </div>
                    <div id="ultimate" class="dropdown_button">
                        <img src="./icons/abilities/Ability_${abilityNames[2]}.png" width="32px" height="32px">
                        <p class="no_text_wrap_overflow">Ultimate Lv. ${charObject.traces.ultimate}</p>
                        <img src="./assets/down_arrow.png" width="16px" height="16px">
                    </div>
                </div>
                <div id="detailed_equipment_display">
                    <div id="head_card" class="equipment_card flex_col"></div>
                    <div id="hands_card" class="equipment_card flex_col"></div>
                    <div id="body_card" class="equipment_card flex_col"></div>
                    <div id="foot_card" class="equipment_card flex_col"></div>
                    <div id="orb_card" class="equipment_card flex_col"></div>
                    <div id="rope_card" class="equipment_card flex_col"></div>
                </div>
            </div>
        </div>
    `;
    showDialog(editDialog);
}

/**
 * Calculates the combat stats of the passed character based on their level, equipment, traces and any potentially active buffs from teammates.
 * @param {Object} charObject The character whose stats are to be calculated. This should be an object from localStorage with the key "char_<name>", without spaces.
 * @returns An object containing all the relevant stats with the following keys:
 *          atk, def, hp, spd, crit_rate, crit_dmg, type_damage, effect_hr, break_effect, energy_regeneration_rate, outgoing_healing, effect_res
 */
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
 * Gets a character's ability names from the global JSON file.
 * @param {string} character The name of the character with spaces.
 * @returns The ability names in an array, with position 0, 1 and 2 being the basic, skill and ultimate respectively.
 */
function getAbilityNames(character) {
    let arr = ["", "", ""]
    if (Array.isArray(characterObjects[character].skills.basic))
        arr[0] = characterObjects[character].skills.basic[0].name;
    else arr[0] = characterObjects[character].skills.basic.name;
    if (Array.isArray(characterObjects[character].skills.skill))
        arr[1] = characterObjects[character].skills.skill[0].name;
    else arr[1] = characterObjects[character].skills.skill.name;
    if (Array.isArray(characterObjects[character].skills.ult))
        arr[2] = characterObjects[character].skills.ult[0].name;
    else arr[2] = characterObjects[character].skills.ult.name;
    return arr;
}

/**
 * Waits for the JSON files to be fetched and then initializes the website.
 */
async function boot() {
    await fetchJSON();
    initialize();
}

boot();