const API_URL = `https://gql.twitch.tv/gql`;
const HEADERS = {
    'Client-Id': "kimne78kx3ncx6brgo4mv6wki5h1ko",
    'Client-Session-Id': "dbbc595729568658",
    'Client-Version': "51d9bb9b-ddab-49c5-9fb6-b236934f29e8",
    'X-Device-Id': "gRLPoKwJ2EAegIGiWJEIhk6HdzQ47S4J"
};

/* Official Twitch API */
const CLIENT_ID = "gkh1z7e7a50gj6cj71obcbu1mgmiql";
const TOKEN_ID = "2p6xttynzyy8s69bcg8lw2s7stu4h4";

export function getBody(nickname) {
    return `[
  {
      "operationName": "VideoPlayerStreamMetadata",
      "variables": {
          "channel": "${nickname}"
      },
      "extensions": {
          "persistedQuery": {
              "version": 1,
              "sha256Hash": "248fee6868e983c4e7b69074e888960f77735bd21a1d4a1d882b55f45d30a420"
          }
      }
  }
]`;
}

export async function fetchGqlAPI(body) {
    let data = await fetch(
        API_URL, {
            method: "POST",
            headers: HEADERS,
            body: body
        })
    return data.json();
}

export async function fetchTwitchAPIUser(streamersList) {
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

export async function fetchTwitchAPIStream(streamersList) {
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

export async function getStreamerId(streamersList) {
    let result = await fetchTwitchAPIUser(streamersList);
}