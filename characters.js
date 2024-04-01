const names = ['Acheron','Argenti','Arlan','Asta','Aventurine','Bailu','BlackSwan','Blade','Boothill','Bronya','Clara','DanHeng','DanHengImbibitorLunae','DrRatio','FuXuan','Gallagher','Gepard','Guinaifen','Hanya','Herta','Himeko','Hook','Huohuo','JingYuan','Jingliu','Kafka','Luka','Luocha','Lynx','March7th','Misha','Natasha','Pela','Qingque','Robin','RuanMei','Sampo','Seele','Serval','SilverWolf','Sparkle','Sushang','Tingyun','TopazAndNumby','TrailblazerFireF','TrailblazerPhysicalM','Welt','Xueyi','Yanqing','Yukong',];

function initialize() {
    let l = document.getElementById("createCharacterList");
    names.forEach(name => {
        addCharacter(l, name);
    });
}

function addCharacter(list, character) {
    let card = document.createElement("div");
    card.classList.add("characterCard");
    let portrait = document.createElement("img");
    portrait.src = `./icons/chars/${character}/icon.png`;
    card.append(portrait);
    let container = document.createElement("div");
    card.append(container);
    for(let i = 1; i < character.length; i++) {
        if (character[i] === character[i].toUpperCase()) {
            character = character.substring(0, i) + " " + character.substring(i);
            i++;
        }
    }
    let name = document.createElement("p");
    name.innerText = character;
    container.append(name);
    list.append(card);
}

initialize();