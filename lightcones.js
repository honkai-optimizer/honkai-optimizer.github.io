
const ownedLCList = document.getElementById("owned_lc_list");
const createLCList = document.getElementById("create_lc_list");
const dialogContainer = document.getElementById("dialog_container");
const addDialog = document.getElementById("add_lc_dialog");
const editDialog = document.getElementById("edit_lc_dialog");
const paths = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let paths_on_owned = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let paths_on_create = ['Abundance', 'Destruction', 'Erudition', 'Harmony', 'Nihility', 'Preservation', 'Hunt'];
let lightCones;

async function fetchLCJSON() {
    await fetch('hsr-data/light_cones.json')
        .then(response => response.json())
        .then(data => {
            lightCones = data;
        });
}

function initializeLC() {
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
    applyFilter('owned');
    sortCards(ownedLCList);
}

function deleteLightcone(name) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
        localStorage.removeItem("lc_" + name);
        document.getElementById(name).remove();
        addLCToCreateList(name);
        sortCards(createLCList);
        closeDialog();
    }
    //TODO: Remove character from relics and lightcone
}

function deleteAllLightcones() {
    if (confirm("Are you sure you want to delete all Light Cones?")) {
        lightCones.forEach(lightcone => {
            localStorage.removeItem("lc_" + lightcone);
            let card = document.getElementById(lightcone);
            if (card != null) {
                card.remove();
                addLCToCreateList(lightcone);
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
        <button id="delete_character" type="button" class="no_text_wrap_overflow delete" onclick="deleteCharacter('${name}')">Delete Character</button>
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
    showDialog(editDialog);
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
    updateCharStats(obj);
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

function formatLCAbility(LCObject, LCData) {
    let abilityDesc = LCData.ability.desc;
    for(let i = 0; i < LCData.ability.params[0].length; i++) {
        abilityDesc.replace("{"+i+"}", LCData.ability.params[LCObject.superimposed-1][i]);
    }
    return abilityDesc;
}