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
        throw new Error(`error! Error: ${result.error} Status: ${result.status} Message: ${result.message}`);
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

async function fetchTwitchAPIStream(streamersList) {
    if (!Array.isArray(streamersList)) {
        throw new Error('parameter must be an array!');
    }
    const apiUrl = `https://api.twitch.tv/helix/streams?user_id=` + streamersList.join('&user_id=');
    const result = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN_ID}`,
            'Client-Id': CLIENT_ID
        }
    });
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

function notificationSender(notificationID, nickname, iconUrl) {
    chrome.notifications.create(
        notificationID, {
            title: `${nickname} est en live !`,
            iconUrl: iconUrl,
            message: 'Rejoins le stream maintenant.',
            type: 'basic'
        });
}

/*async function getStatusPath(name) {
    let isLive = await isOnLive(name);
    return isLive ? "../../img/online-stream.png" : "../../img/offline-stream.png";
}*/

function notificationRemover(notificationID) {
    chrome.notifications.clear(notificationID);
}

async function main() {
    let streamersList = await getStreamersList();
    if (streamersList.length > 0) {
        let streamersData = await fetchTwitchAPIUser(streamersList);
        streamersList.forEach((id) =>
            notificationSender(id.toString(), streamersData[id].display_name, streamersData[id].profile_image_url))
    }
}


async function getStreamersList() {
    const streamersList = await new Promise((resolve) => {
        chrome.storage.local.get(["streamersList"], function (result) {
            resolve(result.streamersList);
        });
    });

    if (streamersList === undefined) {
        chrome.storage.local.set({"streamersList": []});
    }

    return streamersList;
}

chrome.alarms.create({periodInMinutes: 0.1});
chrome.alarms.onAlarm.addListener(main());
chrome.notifications.onClicked.addListener(async (notificationID) => {
    let streamerData = await fetchTwitchAPIUser([notificationID]);
    chrome.tabs.create({url: `https://twitch.tv/${streamerData[notificationID].login}`});
});
