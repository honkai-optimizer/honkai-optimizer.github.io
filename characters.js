const names = ['Acheron','Argenti','Arlan','Asta','Aventurine','Bailu','BlackSwan','Blade','Boothill','Bronya','Clara','DanHeng','DanHengImbibitorLunae','DrRatio','FuXuan','Gallagher','Gepard','Guinaifen','Hanya','Herta','Himeko','Hook','Huohuo','JingYuan','Jingliu','Kafka','Luka','Luocha','Lynx','March7th','Misha','Natasha','Pela','Qingque','Robin','RuanMei','Sampo','Seele','Serval','SilverWolf','Sparkle','Sushang','Tingyun','TopazAndNumby','TrailblazerFireF','TrailblazerPhysicalM','Welt','Xueyi','Yanqing','Yukong',];

const ownedCharList = document.getElementById("ownedCharacterList");
const createCharList = document.getElementById("createCharacterList");
const dialogContainer = document.getElementById("dialogContainer");
const editDialog = document.getElementById("editCharacterDialog");

function initialize() {
    names.forEach(name => {
        addCharToCreateList(createCharList, name);
        const val = localStorage.getItem("char_" + name);
        if (val != null) addCharToOwnedList(name)
    });
    dialogContainer.addEventListener("click", e => {
        if (e.target === dialogContainer)
        closeDialog();
    });
}

function addCharToCreateList(createList, character) {
    const card = createStyledDiv("characterCard");
    const portrait = createPortrait(character);
    card.append(portrait);
    const container = document.createElement("div");
    card.append(container);
    let name = character;
    for(let i = 1; i < name.length; i++) {
        if (name[i] === name[i].toUpperCase()) {
            name = name.substring(0, i) + " " + name.substring(i);
            i++;
        }
    }
    const p = document.createElement("p");
    p.innerText = name;
    container.append(p);
    createList.append(card);
    card.onclick = e => {
        localStorage.setItem("char_" + character, JSON.stringify({
            key: name,
            level: 1,
            ascension: 0,
            traces: {
                basic: 1,
                skill: 1,
                ultimate: 1
            },
            eidolon: 0,
            equip: {}
        }));
        closeDialog();
        addCharToOwnedList(character);
    }
}

function addCharToOwnedList(character) {
    const val = JSON.parse(localStorage.getItem("char_" + character));
    const card = createStyledDiv("characterCard");
    card.innerHTML = /*HTML*/ `
        <div class="infoContainer">
            <img src="./icons/chars/${character}/icon.png" height="124px" width="112px">
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
            <!-- TODO: Add equipment icons -->
        </div>
    `;
    card.onclick = e => openCharacterInfo();
    ownedCharList.append(card);
}

function deleteAllCharacters() {
    if (confirm("Are you sure you want to delete all characters?")) {
        names.forEach(name => {
        localStorage.removeItem("char_" + name);
        });
        ownedCharList.innerHTML = "";
    }
    //TODO: Remove characters from relics and lightcones as well
}

function createPortrait(character) {
    const portrait = document.createElement("img");
    portrait.src = `./icons/chars/${character}/icon.png`;
    return portrait;
}

function createStyledDiv(list) {
    const div = document.createElement("div")
    if (list.constructor === Array) div.classList.add(...list);
    else div.classList.add(list);
    return div;
}

function openCharacterInfo() {
    editDialog.innerHTML = /*HTML*/ `
        <!-- TODO -->
    `;
}

function showDialog() {
    dialogContainer.style.visibility = "visible";
}

function closeDialog() {
    dialogContainer.style.visibility = "hidden";
}


initialize();