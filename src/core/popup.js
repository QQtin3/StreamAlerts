import {addChannel, isOnLive} from "./channelManager.js";


const addButtonElement = document.getElementById("add-button");
const removeButtonElement = document.getElementById("remove-button");
const settingsButtonElement = document.getElementById("settings-button");
const contentContainer = document.getElementById("content");

let streamerData = ["SiirZax", "Marco", "Nartax", "Ordrac (mec bro hermano)", "Omg wtf"]

async function addStreamer(name) {
    let resultChannel = await addChannel(name, streamerData);
    switch (resultChannel) {
        case -2:
            alert(`Value error : ${name} is already in the list!`);
            break;

        case -1:
            alert("Error 404 : Channel not found!");
            break;

        case 1:
            streamerData.push(name);
            await createStreamerDiv(name);
            break;

        case 2:
            streamerData.push(name);
            await createStreamerDiv(name);
            break;
    }
}

function removeStreamer(name) {
    let index = streamerData.indexOf(name);
    if (index !== -1) {
        streamerData.splice(index, 1);
        document.getElementById(`streamer${index}`).remove();
    } else {
        alert("Error 404 : Channel not found!");
    }
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

async function getStatusPath(name) {
    let isLive = await isOnLive(name);
    return isLive ? "../../img/online-stream.png" : "../../img/offline-stream.png"
}

async function createStreamerDiv(name, i) {
    const streamerDiv = document.createElement("div");
    streamerDiv.className = `streamer`;
    streamerDiv.id = `streamer${i}`;

    const channelLink = document.createElement("a");
    channelLink.className = "channelLink";
    channelLink.href = `https://twitch.tv/${name}`;
    channelLink.target = '_blank';

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
    statusImg.src = await getStatusPath(name);
    statusImg.alt = "Streamer status";
    statusImg.id = `streamer${i}-status`;
    statusDiv.appendChild(statusImg);

    channelLink.appendChild(namePictureDiv);
    channelLink.appendChild(statusDiv);
    streamerDiv.appendChild(channelLink);
    contentContainer.appendChild(streamerDiv);
}

async function setupStreamerDiv() {
    for (let i = 0; i < streamerData.length; i++) {
        await createStreamerDiv(streamerData[i], i);
    }
}

async function dynamicStatusChange(streamers) {
    for (let i = 0; i < streamers.length; i++) {
        document.getElementById(`streamer${i}-status`).src = await getStatusPath(streamers[i]);
    }
}

addButtonElement.addEventListener("click", () => {
    document.getElementById("popup-add").style.display = "block";
});
removeButtonElement.addEventListener("click", () => {
    document.getElementById("popup-remove").style.display = "block";
});
settingsButtonElement.addEventListener("click", settingsButton);

/* Add new streamer with the input */
document.getElementById("submit-btn-name-input-add").addEventListener("click", async () => {
    let nameInputContent = document.getElementById("name-input-add").value;
    await addStreamer(nameInputContent);
    quitPopup("popup-add");
});

document.getElementById("popup-quit-add").addEventListener("click", () => {
    quitPopup("popup-add");
});

document.getElementById("submit-btn-name-input-remove").addEventListener("click", () => {
    let nameInputContent = document.getElementById("name-input-remove").value;
    removeStreamer(nameInputContent);
    quitPopup("popup-remove");
});

document.getElementById("popup-quit-remove").addEventListener("click", () => {
    quitPopup("popup-remove");
});


document.addEventListener("DOMContentLoaded", async function () {
    await setupStreamerDiv();
});

/* AUTO UPDATE Status each minute*/
chrome.alarms.create({periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(async () => {
    await dynamicStatusChange()
});
