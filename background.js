/* Official Twitch API */
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

function notificationRemover(notificationID) {
    chrome.notifications.clear(notificationID);
}

async function main(streamersList) {
    let streamersData = await fetchTwitchAPIUser(streamersList);
    streamersList.forEach((id) =>
        notificationSender(id.toString(), streamersData[id].display_name, streamersData[id].profile_image_url))
}


let streamersList = [38978803, 35906674, 498974198];

chrome.alarms.create({periodInMinutes: 0.1});

chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({url: twitchUrl});
});

chrome.alarms.onAlarm.addListener(() => console.log("TEST"));

main(streamersList);