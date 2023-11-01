import { addChannel } from "./channelManager.js";


const addButtonElement = document.getElementById("add-button");
const removeButtonElement = document.getElementById("remove-button");
const settingsButtonElement = document.getElementById("settings-button");
const contentContainer = document.getElementById("content");

let streamerData = ["SiirZax", "Marco", "Nartax", "Ordrac (mec bro hermano)", "Omg wtf"]

async function addStreamer(name) {

    let resultChannel = await addChannel(name);
    switch (resultChannel) {
        case -1:
            alert("Error 404 : Channel not found");
            break;
        case 1:
            streamerData.push(name);
            createStreamerDiv(name);
            break;
        case 2:
            streamerData.push(name);
            createStreamerDiv(name);
            break;
    }
}

function removeStreamer() {
    alert("test");
}

function settingsButton() {
    alert("test2");
}

function quitPopup(div) {
    const parentDiv = document.getElementById(div);
    if (parentDiv) {
        parentDiv.style.display = 'none';
    }
}

function createStreamerDiv(name) {
    const streamerDiv = document.createElement("div");
    streamerDiv.className = "streamer";

    const namePictureDiv = document.createElement("div");
    namePictureDiv.className = "name-picture";

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const logoImg = document.createElement("img");
    logoImg.src = "../../img/twitch-certified-logo.png";
    logoImg.alt = "Streamer's Logo";
    logoDiv.appendChild(logoImg);

    const nameDiv = document.createElement("div");
    nameDiv.className = "name";

    const nameHeading = document.createElement("h1");
    nameHeading.textContent = name;
    nameDiv.appendChild(nameHeading);

    namePictureDiv.appendChild(logoDiv);
    namePictureDiv.appendChild(nameDiv);

    const statusDiv = document.createElement("div");
    statusDiv.className = "status";
    const statusImg = document.createElement("img");
    statusImg.src = "../../img/offline-stream.png";
    statusImg.alt = "Streamer status";
    statusImg.id = "streamer";
    statusDiv.appendChild(statusImg);

    streamerDiv.appendChild(namePictureDiv);
    streamerDiv.appendChild(statusDiv);

    contentContainer.appendChild(streamerDiv);
}

function setupStreamerDiv() {
    for (let i = 0; i < streamerData.length; i++) {
        createStreamerDiv(streamerData[i]);
    }
}

addButtonElement.addEventListener("click", () => {
    document.getElementById("popup-add").style.display = "block";
});
removeButtonElement.addEventListener("click", removeStreamer);
settingsButtonElement.addEventListener("click", settingsButton);

/* Add new streamer with the input */
document.getElementById("submit-btn-name-input").addEventListener("click", () => {
    let nameInputContent = document.getElementById("name-input").value;
    addStreamer(nameInputContent);
    quitPopup("popup-add");
});

document.getElementById("popup-quit-add").addEventListener("click", () => {
    quitPopup("popup-add");
});


document.addEventListener("DOMContentLoaded", function () {
    setupStreamerDiv();
});