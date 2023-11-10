import {fetchTwitchAPIStream} from "./src/core/twitchAPI";

const CLIENT_ID = "gkh1z7e7a50gj6cj71obcbu1mgmiql";
const TOKEN_ID = "2p6xttynzyy8s69bcg8lw2s7stu4h4";

async function fetchTwitchAPIUser(streamersList) {
    if (!Array.isArray(streamersList)) {
        throw new Error('parameter must be an array!');
    }

    let apiUrl = `https://api.twitch.tv/helix/users?id=` + streamersList.join('&id=');
    let result = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN_ID}`,
            'Client-Id': CLIENT_ID
        }
    });
    if (!result.ok) {
        throw new Error(`error! Status: ${result.status} please refers to the Twitch API documentation or to the README`);
    }
    const data = {};
    let resultJson = await result.json();
    resultJson["data"].forEach((result) => data[result.id] = {
        "login": result.login,
        "display_name": result.display_name,
        "type": result.type,
        "broadcaster_type": result.broadcaster_type,
        "description": result.description,
        "profile_image_url": result.profile_image_url,
        "offline_image_url": result.offline_image_url,
        "view_count": result.view_count,
        "email": result.email,
        "created_at": result.created_at
    });
    return data;
}

function notificationSender(notificationID, nickname, iconUrl) {
    chrome.notifications.create(
        notificationID, {
            title: `${nickname} est en live !`,
            iconUrl: iconUrl,
            message: 'Rejoins le stream maintenant.',
            type: 'basic'
        });
}

function notificationRemover(notificationID) {
    chrome.notifications.clear(notificationID);
}

async function main() {
    let streamersList = await getStreamersList();
    if (streamersList.length > 0) {
        let streamersData = await fetchTwitchAPIUser(streamersList);
        dynamicStatusChange(streamersList, streamersData);
        streamersList.forEach((id) =>
            notificationSender(id.toString(), streamersData[id].display_name, streamersData[id].profile_image_url))
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

async function getStreamersList() {
    const streamersList = await new Promise((resolve) => {
        chrome.storage.sync.get(["streamersList"], function (result) {
            resolve(result.streamersList);
        });
    });

    if (streamersList === undefined) {
        chrome.storage.sync.set({"streamersList": []});
    }
    return streamersList;
}

chrome.alarms.create({periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(main());
chrome.notifications.onClicked.addListener(async (notificationID) => {
    let streamerData = await fetchTwitchAPIUser([notificationID]);
    chrome.tabs.create({url: `https://twitch.tv/${streamerData[notificationID].login}`});
});