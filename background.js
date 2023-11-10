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


async function getStreamersList() {
    let streamersList = await new Promise((resolve) => {
        chrome.storage.sync.get(["streamersList"], function (result) {
            resolve(result.streamersList);
        });
    });

    if (streamersList === undefined) {
        streamersList = [];
        chrome.storage.sync.set({"streamersList": []});
    }
    return streamersList;
}

async function getStreamsStatus() {
    let streamsStatus = await new Promise((resolve) => {
        chrome.storage.sync.get(["streamsStatus"], function (result) {
            resolve(result.streamsStatus);
        });
    });

    if (streamsStatus === undefined) {
        streamsStatus = {};
        chrome.storage.sync.set({"streamsStatus": {}});
    }
    return streamsStatus;
}

async function notificationManager(streamersList) {
    if (streamersList.length > 0) {
        let streamsStatus = await getStreamsStatus();
        let streamersData = await fetchTwitchAPIUser(streamersList);
        console.log("manager:" + streamsStatus);

        streamersList.forEach((id) => {
            if (streamsStatus[id].status === 1 && streamsStatus[id].notifHasBeenSent === 0) {
                notificationSender(id.toString(), streamersData[id].display_name, streamersData[id].profile_image_url);
                streamsStatus[id].notifHasBeenSent = 1;
            } else if (streamsStatus[id].status === 0 && streamsStatus[id].notifHasBeenSent === 1) {
                notificationRemover(id.toString());
                streamsStatus[id].notifHasBeenSent = 0;
            }
        });
        chrome.storage.sync.set({"streamsStatus": streamsStatus});
    }
}


chrome.alarms.create({periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(async () => {
    let streamersList = await getStreamersList();
    notificationManager(streamersList);
});
chrome.notifications.onClicked.addListener(async (notificationID) => {
    let streamerData = await fetchTwitchAPIUser([notificationID]);
    chrome.tabs.create({url: `https://twitch.tv/${streamerData[notificationID].login}`});
});