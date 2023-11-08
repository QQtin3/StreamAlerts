/* Official Twitch API */
const CLIENT_ID = "gkh1z7e7a50gj6cj71obcbu1mgmiql";
const TOKEN_ID = "2p6xttynzyy8s69bcg8lw2s7stu4h4";


export async function fetchTwitchAPIUser(streamersList, type = "id") {
    if (!Array.isArray(streamersList)) {
        throw new Error('Parameter must be an array!');
    }

    let apiUrl;
    if (type === "id") {
        apiUrl = `https://api.twitch.tv/helix/users?id=` + streamersList.join('&id=');
    } else if (type === "login") {
        apiUrl = `https://api.twitch.tv/helix/users?login=` + streamersList.join('&login=');
    } else {
        throw new Error('Type must be either "id" or "login" !');
    }

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
    if (type === "id") {
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
    }
    else {
        resultJson["data"].forEach((result) => data[result.login] = {
            "id": result.id,
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
    }
    return data;
}

export async function fetchTwitchAPIStream(streamersList) {
    if (!Array.isArray(streamersList)) {
        throw new Error('Parameter must be an array!');
    }
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