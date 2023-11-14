const CLIENT_ID = "gkh1z7e7a50gj6cj71obcbu1mgmiql";
const TOKEN_ID = "2p6xttynzyy8s69bcg8lw2s7stu4h4";


/**
 * Fetch Official Twitch API to return data about a Streamer with his ID, data retrieved from this function
 * can be found on the README.
 *
 * @param streamersList array fulfilled with IDs of Streamers or with names if type = "login"
 * @return data array fulfilled with exported data from the API
 */
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

/**
 * Fetch Official Twitch API to return data about a Twitch Stream (with Streamer's ID), data retrieved from this
 * function can be found on the README.
 *
 * @param streamersList array fulfilled with IDs of Streamer(s)
 * @return data array fulfilled with exported data from the API
 */
async function fetchTwitchAPIStream(streamersList) {
    if (!Array.isArray(streamersList)) {
        throw new Error('Parameter must be an array!');
    }
    if (streamersList.length > 0) {
        const apiUrl = `https://api.twitch.tv/helix/streams?user_id=` + streamersList.join('&user_id=');
        const result = await fetch(apiUrl, {
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
        resultJson["data"].forEach((result) => data[result.user_id] = {
            "id": result.id,
            "user_login": result.user_login,
            "user_name": result.user_name,
            "game_id": result.game_id,
            "game_name": result.game_name,
            "type": result.type,
            "title": result.title,
            "tags": result.tags,
            "viewer_count": result.viewer_count,
            "started_at": result.started_at,
            "language": result.language,
            "thumbnail_url": result.thumbnail_url,
            "tag_ids": result.tag_ids,
            "is_mature": result.is_mature
        });
        return data;
    }
}

function dynamicStatusChange(streamersList, streamData, streamsStatus) {
    streamersList.forEach((id) => {
        if (!!streamData[id]?.id) {
            streamsStatus[id].status = 1;
        } else {
            streamsStatus[id].status = 0;
        }
    });
    chrome.storage.sync.set({"streamsStatus": streamsStatus});
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

async function notificationManager(streamersList, streamersData, streamsStatus) {
    if (streamersList.length > 0) {
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

/* DEBUG PART ONLY - RESET STORAGE TO ZERO
chrome.storage.sync.set({"streamsStatus": {}});
chrome.storage.sync.set({"streamersList": []});*/

chrome.alarms.create({periodInMinutes: 0.1});
chrome.alarms.onAlarm.addListener(async () => {
    let streamersList = await getStreamersList();
    let streamerData = await fetchTwitchAPIUser(streamersList);
    let streamData = await fetchTwitchAPIStream(streamersList);
    let streamStatus = await getStreamsStatus();
    await dynamicStatusChange(streamersList, streamData, streamStatus);
    await notificationManager(streamersList, streamerData, streamStatus);
});

chrome.notifications.onClicked.addListener(async (notificationID) => {
    let streamerData = await fetchTwitchAPIUser([notificationID]);
    chrome.tabs.create({url: `https://twitch.tv/${streamerData[notificationID].login}`});
});