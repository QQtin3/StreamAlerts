/* Official Twitch API Tokens*/
// TODO: Replace this with an automatic system avoiding issues.
const CLIENT_ID = "gkh1z7e7a50gj6cj71obcbu1mgmiql";
const TOKEN_ID = "2p6xttynzyy8s69bcg8lw2s7stu4h4";


/**
 * Fetch Official Twitch API to return data about a Streamer (with his ID or name), data retrieved from this function
 * can be found on the README.
 *
 * @param streamersList array fulfilled with IDs of Streamers or with names if type = "login"
 * @param type default="id"
 * @return data array fulfilled with exported data from the API
 */
export async function fetchTwitchAPIUser(streamersList, type = "id") {
    if (!Array.isArray(streamersList)) {
        throw new Error('Parameter must be an array!');
    } else if (streamersList.length < 1) {
        throw new Error('Array is empty!');
    } else {
        let apiUrl;
        if (type === "id") {
            apiUrl = `https://api.twitch.tv/helix/users?id=` + streamersList.join('&id=');
        } else {
            apiUrl = `https://api.twitch.tv/helix/users?login=` + streamersList.join('&login=');
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
        } else {
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
}

/**
 * Fetch Official Twitch API to return data about a Twitch Stream (with Streamer's ID), data retrieved from this
 * function can be found on the README.
 *
 * @param streamersList array fulfilled with IDs of Streamer(s)
 * @return data array fulfilled with exported data from the API
 */
export async function fetchTwitchAPIStream(streamersList) {
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