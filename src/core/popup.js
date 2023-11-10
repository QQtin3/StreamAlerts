import {addStreamer, getStreamersList, getStreamsStatus, removeStreamer} from "./channelManager.js";
import {fetchTwitchAPIStream, fetchTwitchAPIUser} from "./twitchAPI.js";

const addButtonElement = document.getElementById("add-button");
const removeButtonElement = document.getElementById("remove-button");
const settingsButtonElement = document.getElementById("settings-button");
const contentContainer = document.getElementById("content");

function settingsButton() {
    alert("test2");
}

function quitPopup(divName) {
    const parentDiv = document.getElementById(divName);
    if (parentDiv) {
        parentDiv.style.display = 'none';
    }
}

function dynamicStatusChange(streamersList, streamData) {
    streamersList.forEach((id) => {
        if (!!streamData[id]?.id) {
            document.getElementById(`streamer${id}-status`).src = "../../img/online-stream.png";
        } else {
            document.getElementById(`streamer${id}-status`).src = "../../img/offline-stream.png";
        }
    });
}

export async function createStreamerDiv(streamerData, streamData, id) {
    const streamerDiv = document.createElement("div");
    streamerDiv.className = `streamer`;
    streamerDiv.id = `streamer${id}`;

    const channelLink = document.createElement("a");
    channelLink.className = "channelLink";
    channelLink.href = `https://twitch.tv/${streamerData[id].login}`;
    channelLink.target = '_blank';

    const namePictureDiv = document.createElement("div");
    namePictureDiv.className = "name-picture";

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const logoImg = document.createElement("img");
    logoImg.src = streamerData[id].profile_image_url;
    logoImg.alt = "Streamer's Logo";
    logoDiv.appendChild(logoImg);

    const nameDiv = document.createElement("div");
    nameDiv.className = "name";

    const nameHeading = document.createElement("h1");
    nameHeading.textContent = streamerData[id].display_name;
    nameDiv.appendChild(nameHeading);

    if (streamerData[id].broadcaster_type === "partner") {
        const twitchPartnerImg = document.createElement("img");
        twitchPartnerImg.src = "../../img/twitch-certified-logo.png";
        twitchPartnerImg.alt = "Twitch Partner";
        nameDiv.appendChild(twitchPartnerImg);
    }

    namePictureDiv.appendChild(logoDiv);
    namePictureDiv.appendChild(nameDiv);

    const statusDiv = document.createElement("div");
    statusDiv.className = "status";
    const statusImg = document.createElement("img");
    statusImg.src = "../../img/offline-stream.png";  // Voir condition du dessous pour le cas online
    statusImg.alt = "Streamer status";
    statusImg.id = `streamer${id}-status`;
    statusDiv.appendChild(statusImg);

    if (!!streamData[id]?.id) {
        statusImg.src = "../../img/online-stream.png";

        const streamInfo = document.createElement("p");
        streamInfo.textContent = `"${streamData[id].title}"  sur  ${streamData[id].game_name}`;
        nameDiv.appendChild(streamInfo);

        nameHeading.style.marginBottom = "0";
    }

    channelLink.appendChild(namePictureDiv);
    channelLink.appendChild(statusDiv);
    streamerDiv.appendChild(channelLink);
    contentContainer.appendChild(streamerDiv);
}

async function setupStreamerDiv(streamersList) {
    if (streamersList.length > 0) {
        const streamerData = await fetchTwitchAPIUser(streamersList);
        const streamData = await fetchTwitchAPIStream(streamersList);

        streamersList.forEach((id) =>
            createStreamerDiv(streamerData, streamData, id));
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

document.getElementById("submit-btn-name-input-remove").addEventListener("click", async () => {
        let nameInputContent = document.getElementById("name-input-remove").value;
        await removeStreamer(nameInputContent);
        quitPopup("popup-remove");
    }
)

document.getElementById("popup-quit-remove").addEventListener("click", () => {
    quitPopup("popup-remove");
});


async function setup() {
    let streamersList = await getStreamersList();
    let streamsStatus = await getStreamsStatus();
    console.log(streamsStatus);
    console.log(streamersList);
    await setupStreamerDiv(streamersList);
}

chrome.alarms.create({periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(async () => {
    let streamersList = await getStreamersList();
    let streamData = await fetchTwitchAPIStream(streamersList);
    dynamicStatusChange(streamersList, streamData);
});


setup();
/* AUTO UPDATE Status each minute*/
