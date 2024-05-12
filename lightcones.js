const ownedLightconeList = document.getElementById("owned_lightcone_list");
const createLightconeList = document.getElementById("create_lightcone_list");

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
    for (let cone in lightCones) {
        const val = localStorage.getItem("lightcone_" + cone.name);
        if (val != null) addLightconeToOwnedList(cone.name);
        else addLightconeToCreateList(cone.name);
    }
    dialogContainer.addEventListener("click", e => {
        if (e.target === dialogContainer) {
            closeDialog();
        }
    });
}

/**
 * Shows the dialog represented by the passed div element. It should be a child of the div dialog_container.
 * @param {HTMLDivElement} div The element to display. 
 */
function showDialog(div) {
    dialogContainer.style.visibility = "visible";
    div.style.display = "flex";
}

async function boot() {
    await fetchJSON();
    initialize();
}

boot();