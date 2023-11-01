const addButtonElement = document.getElementById("add-button");
const removeButtonElement = document.getElementById("remove-button");
const settingsButtonElement = document.getElementById("settings-button");
const contentContainer = document.getElementById("content");
const quitButtons = document.querySelectorAll(".quit");
const nameInputContent = document.getElementById("name-input").value;

let streamerData = ["SiirZax", "Marco", "Nartax", "Ordrac (mec bro hermano)", "Omg wtf"]

function addStreamer(name) {
    streamerData.push(name);
    createStreamerDiv(name);
}

function removeStreamer() {
    alert("test");
}

function settingsButton() {
    alert("test2");
}

function openPopup(div) {
    const childrenDiv = div.closest('.children');
    if (childrenDiv) {
        childrenDiv.style.display = 'inherit';
    }
}

function quitPopup(div) {
    const parentDiv = div.closest('.parent');
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

addButtonElement.addEventListener("click", addStreamer);
removeButtonElement.addEventListener("click", removeStreamer);
settingsButtonElement.addEventListener("click", settingsButton);

quitButtons.forEach(quitDiv => {
    quitDiv.addEventListener("click", quitPopup(quitDiv));
})


document.addEventListener("DOMContentLoaded", function () {
    setupStreamerDiv();
});