
const ownedLCList = document.getElementById("owned_lc_list");
const createLCList = document.getElementById("create_lc_list");
const dialogContainerLC = document.getElementById("dialog_container");
const addDialog = document.getElementById("add_lc_dialog");
const editDialog = document.getElementById("edit_lc_dialog");
const pathsLC = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let pathsOnOwnedLC = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let pathsOnCreateLC = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let lightCones;

async function fetchLCJSON() {
    await fetch('hsr-data/light_cones.json')
        .then(response => response.json())
        .then(data => {
            lightCones = data;
        });
}

function initializeLC() {
    Object.keys(lightCones).forEach(name => {
        withoutSpaces = name.replace(/ /g, '');
        const val = localStorage.getItem("lc_" + withoutSpaces);
        if (val != null) addLCToOwnedList(withoutSpaces)
        else addLCToCreateList(withoutSpaces);
    });
    dialogContainerLC.addEventListener("click", e => {
        if (e.target === dialogContainerLC) {
            closeDialogLC();
        }
    });
}

function addLCToCreateList(name) {
    const withSpaces = addSpaces(name);
    const path = lightCones[withSpaces].path === "The Hunt" ? "Hunt" : lightCones[withSpaces].path;
    const card = createDiv(["mini_card", "flex_col", path]);
    const imgPath = name == "WhatIsReal?" ? "WhatIsReal.png" : name + ".png";
    card.id = name;
    card.innerHTML = /*HTML*/ `
        <div class="info_container">
            <img class="portrait" src="./icons/lightcones/${imgPath}" height="124px" width="112px">
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
        closeDialogLC();
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
            <div class="info_text">
                <div>
                    <p id="card_text">${addSpaces(name)}<br>
                    Lvl. ${val.level} S${val.superimposed}</p>
                </div>
                <img src="./icons/rarity/${lightCones[addSpaces(name)].rarity}.png" height="30px" width="128px">
            </div>
        </div>
        <div class="location dropdown_menu" onclick="changeLocation(name)">
            <img src="./icons/chars/${val.location}.png">
            <p>${val.location}</p>
            <i class="fa fa-chevron-down"></i>
        </div>
        <div class="edit button">
            <i class="fa-solid fa-pen-to-square"></i>
        </div>
        <div class="delete button">
            <i class="fa-solid fa-trash"></i>
        </div>
    `;
    ownedLCList.append(card);
    applyFilterLC('owned');
    sortCards(ownedLCList);
}

function deleteLightcone(name) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
        localStorage.removeItem("lc_" + name);
        document.getElementById(name).remove();
        addLCToCreateList(name);
        sortCards(createLCList);
        closeDialogLC();
    }
    //TODO: Remove character from relics and lightcone
}

function deleteAllLightcones() {
    if (confirm("Are you sure you want to delete all Light Cones?")) {
        Object.keys(lightCones).forEach(lightcone => {
            withoutSpaces = lightcone.replace(/ /g, '');
            localStorage.removeItem("lc_" + withoutSpaces);
            let card = document.getElementById(withoutSpaces);
            if (card != null) {
                card.remove();
                addLCToCreateList(withoutSpaces);
            }
        });
        sortCards(createLCList);
    }
    //TODO: Remove characters from relics and lightcones
}

function openLCInfo(name) {
    const LCObject = JSON.parse(localStorage.getItem("lc_" + name));
    const LCData = lightCones[addSpaces(name)];
    const stats = calculateLCStats(LCObject);
    editDialog.innerHTML = /*HTML*/ `
        <button id="delete_character" type="button" class="no_text_wrap_overflow delete" onclick="deleteLightcone('${name}')">Delete Lightcone</button>
        <div id="edit_info_container" class="flex">
            <div id="edit_info_left_segment">
                <div id="left_container" class="flex_col">
                    <img class="portrait" src="./icons/lightcones/${name}.png" height="210px" width="150px">
                    <p id="flavor_text">${LCData.desc}</p>
                </div>
            </div>
            <div id="edit_info_right_segment">
                <div id="right_container" class="flex_col">
                    <div id="level_container">
                        <div id="level_text" class="stat_text">Lvl. ${LCObject.level}/${LCObject.ascension * 10 + 20}</div>
                        <div id="level" class="dropdown_container">
                            <div class="dropdown_button" onclick="toggleLCLevelDropdown('${name}')">
                                <p>Select</p>
                                <i class="fa fa-chevron-down"></i>
                            </div>
                        </div>
                        <div id="superimposition_text" class="stat_text">Superimposition ${LCObject.superimposed}</div>
                        <div id="superimposition" class="dropdown_container">
                            <div class="dropdown_button" onclick="toggleSuperimposeDropdown('${name}')">
                                <p>Select</p>
                                <i class="fa fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <img src="./icons/rarity/${LCData.rarity}.png">
                    <div class="stat_text">${LCData.ability.name}</div>
                    <p id="ability_description">${formatLCAbility(LCObject, LCData)}</p>
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
                </div>
            </div>
        </div>
        <div id="${name}_location" class="location dropdown_menu" onclick="changeLocation(name)">
            <img src="./icons/chars/${val.location}.png">
            <p>${val.location}</p>
            <i class="fa fa-chevron-down"></i>
        </div>
    `;
    showCharDialog(editDialog);
}

function toggleLCLevelDropdown(name) {
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
    let obj = JSON.parse(localStorage.getItem("lc_" + name));
    for (let i = 0; i <= 6; i++) {
        let option_1 = createDiv("dropdown_option");
        option_1.style.paddingInline = "5px";
        option_1.innerText = (i == 0 ? 1 : (i - 1) * 10 + 20) + "/" + (i * 10 + 20);
        option_1.onclick = e => updateLCLevel(name, option_1, i, container);
        let option_2 = createDiv("dropdown_option");
        option_2.style.paddingInline = "5px";
        option_2.innerText = (i * 10 + 20) + "/" + (i * 10 + 20);
        option_2.onclick = e => updateLCLevel(name, option_2, i, container);
        menu.append(option_1);
        menu.append(option_2);
    }
}

function updateLCLevel(name, option, ascension, container) {
    let obj = JSON.parse(localStorage.getItem("lc_" + name));
    let lvlText = option.innerText.split("/");
    obj.level = lvlText[0];
    obj.ascension = ascension;
    localStorage.setItem("lc_" + name, JSON.stringify(obj));
    container.parentElement.querySelector(".stat_text").innerText = "Lvl. " + lvlText[0] + "/" + lvlText[1];
    toggleLCLevelDropdown(name);
    updateLCCard(name);
    updateLCStats(obj);
}

function updateLCStats(obj) {
    const stats = calculateLCStats(obj);
    for (let key in stats) {
        document.getElementById(key).innerText = key.replace(/_/g, " ") +": " + stats[key];
    }
}

function updateLCCard(name) {
    let obj = JSON.parse(localStorage.getItem("lc_" + name));
    let levelText = document.getElementById("level_text");
    levelText.innerHTML = name + "<br>" + "Lvl. " + obj.level + " S" + obj.superimposed;
    let location = document.getElementById(name + "_location");
    location.children[0].src = "./icons/chars/" + obj.location + ".png";
    location.children[1].innerHTML = obj.location;
}

function toggleSuperimposeDropdown(name) {
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
    let menuLength = 5;
    let menu = createDiv(["dropdown_menu", "flex_col"]);
    menu.style.position = "relative";
    container.append(menu);
    for (let i = 1; i <= menuLength; i++) {
        let option = createDiv("dropdown_option");
        option.innerText = "S" + i;
        option.onclick = e => {
            let obj = JSON.parse(localStorage.getItem("lc_" + name));
            obj.superimposed = i;
            localStorage.setItem("lc_" + name, JSON.stringify(obj));
            document.getElementById("superimposition_text").innerText = "Superimposition " + i;
            toggleSuperimposeDropdown(name);
            updateLCCard(name);
        };
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

function calculateLCStats(obj) {
    const ascension = lightCones[obj.key].ascension[obj.ascension];
    const stats = {};
    for (let key in ascension) {
            stats[key.toUpperCase()] = Math.floor(ascension[key].base + ascension[key].step * (obj.level - 1));
            break;
    }
    return stats;
}

function showLCDialog(div) {
    dialogContainerLC.style.visibility = "visible";
    div.style.display = "flex";
}

function toggleButtonClickLC(list, btn) {
    if (list == 'owned') {
        let buttons = document.getElementById("button_wrapper").querySelectorAll(".filter_button.Abundance, .filter_button.Erudition, .filter_button.Nihility, .filter_button.Preservation, .filter_button.Harmony, .filter_button.Destruction, .filter_button.Hunt");
        if (pathsLC.length == pathsOnOwnedLC.length) {
            pathsOnOwnedLC = [btn];
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
            if (pathsOnOwnedLC.includes(btn)) {
                pathsOnOwnedLC.splice(pathsOnOwnedLC.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (pathsOnOwnedLC.length == 0) {
                    pathsOnOwnedLC = pathsLC;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                pathsOnOwnedLC.push(btn);
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
        if (pathsLC.length == pathsOnCreateLC.length) {
            pathsOnCreateLC = [btn];
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
            if (pathsOnCreateLC.includes(btn)) {
                pathsOnCreateLC.splice(pathsOnCreateLC.indexOf(btn), 1);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("on");
                        button.classList.add("off");
                    }
                });
                if (pathsOnCreateLC.length == 0) {
                    pathsOnCreateLC = pathsLC;
                    buttons.forEach(button => {
                        button.classList.add("on");
                        button.classList.remove("off");
                    });
                }
            } else {
                pathsOnCreateLC.push(btn);
                buttons.forEach(button => {
                    if (button.classList.contains(btn)) {
                        button.classList.remove("off");
                        button.classList.add("on");
                    }
                });
            }
        }
    }
    applyFilterLC(list);
}

function applyFilterLC(list) {
    let show = [];
    let cards;
    if (list == 'owned') {
        cards = ownedLCList.querySelectorAll(".lightcone.card");
        cards.forEach(lightcone => {
            pathsOnOwnedLC.forEach(path => {
                if (lightcone.classList.contains(path)) show.push(lightcone);
            });
        });
        cards.forEach(lightcone => {
            lightcone.style.display = show.includes(lightcone) ? "flex" : "none";
        });
    }
    else {
        cards = createLCList.querySelectorAll(".mini.card");
        cards.forEach(lightcone => {
            pathsOnOwnedLC.forEach(path => {
                if (lightcone.classList.contains(path)) show.push(lightcone);
            });
        });
        cards.forEach(lightcone => {
            lightcone.style.display = show.includes(lightcone) ? "flex" : "none";
        });
    }
}

function closeDialogLC() {
    dialogContainerLC.style.visibility = "hidden";
    for (const child of dialogContainerLC.children) child.style.display = "none";
    addDialog.querySelectorAll(".path_button").forEach(button => {
        button.classList.add("on");
        button.classList.remove("off");
    });
    pathsOnCreateLC = pathsLC;
    applyFilterLC('create');
}

function formatLCAbility(LCObject, LCData) {
    let abilityDesc = LCData.ability.desc;
    for(let i = 0; i < LCData.ability.params[0].length; i++) {
        abilityDesc.replace("{"+i+"}", LCData.ability.params[LCObject.superimposed-1][i]);
    }
    return abilityDesc;
}

function createDiv(arr) {
    const div = document.createElement("div")
    if (arr.constructor === Array) div.classList.add(...arr);
    else div.classList.add(arr);
    return div;
}

function addSpaces(name) {
    if (name === "Geniuses'Repose") return "Geniuses' Repose"
    if (name === "RiverFlowsinSpring") return "River Flows in Spring"
    if (name === "PastSelfinMirror") return "Past Self in Mirror"
    if (name === "CruisingintheStellarSea") return "Cruising in the Stellar Sea"
    for (let i = 1; i < name.length; i++) {
        if (name[i] === name[i].toUpperCase() && name[i] != "-" && name[i-1] != "-" && name[i] != "\'" && name[i-1] != "\'" && name[i] != "!" && name[i] != "," && name[i] != "?") {
            name = name.substring(0, i) + " " + name.substring(i);
            i++;
        } else if (name.length > i + 3) {
            if (name[i] === "t" && name[i+1] === "h" && name[i+2] === "e") {
                if (name == "Today Is AnotherPeacefulDay") return "Today Is Another Peaceful Day";
                if (name == "OntheFallofanAeon") return "On the Fall of an Aeon";
                name = name.substring(0, i) + " " + name.substring(i);
                i++;
            }
            else if(name[i] === "o" && name[i+1] === "f") {
                if (name === "Woof!WalkTime!") return "Woof! Walk Time!"
                if (name === "EchoesoftheCoffin") return "Echoes of the Coffin"
                name = name.substring(0, i) + " " + name.substring(i);
                i++;
            }
            else if(name[i] === "i" && name[i+1] === "n" && name[i+2] === name[i+2].toUpperCase) {
                name = name.substring(0, i) + " " + name.substring(i);
                i++;
            }
            else if(name[i] === "t" && name[i+1] === "o") {
                if (name == "NightontheMilkyWay") return "Night on the Milky Way";
                if (name == "NightofFright") return "Night of Fright";
                if (name == "MomentofVictory") return "Moment of Victory";
                name = name.substring(0, i) + " " + name.substring(i);
                i++;
            }
            else if(name[i] === "a" && name[i+1] === "n" && name[i+2] === "d") {
                if (name === "Landau'sChoice") return "Landau's Choice"
                name = name.substring(0, i) + " " + name.substring(i);
                i++;
            }
            else if(name[i] === "f" && name[i+1] === "o" && name[i+2] === "r") {
                if (name == "BeforetheTutorialMissionStarts") return "Before the Tutorial Mission Starts";
                if (name == "BeforeDawn") return "Before Dawn";
                if (name == "An Instant BeforeAGaze") return "An Instant Before A Gaze";
                if (name == "ReforgedRemembrance") return "Reforged Remembrance";
                name = name.substring(0, i) + " " + name.substring(i);
                i++;
            }
        }
    }
    return name;
}

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

async function bootLC() {
    await fetchLCJSON();
    initializeLC();
}

bootLC();