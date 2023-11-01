import {API_URL, HEADERS, fetchTwitchAPI, getBody} from "./twitchAPI.js";

export async function addChannel(name, streamers) {
    let twitchChannelURL = `https://www.twitch.tv/${name}`;
    let doesUserExists = await doesChannelExists(name);
    if (streamers.includes(name)) {
        return -2;
    }
    else if (!doesUserExists) {
        return -1;
    }
    else {
        if (await isPartner(twitchChannelURL)) {
            return 2;
        } else {
            return 1;
        }
    }
}

export async function doesChannelExists(name) {
    let data = await fetchTwitchAPI(API_URL, HEADERS, getBody(name));
    return !!data[0]?.data?.user;
}

export async function isPartner(twitchChannelURL) {
}

export async function isOnLive(name) {
    let data = await fetchTwitchAPI(API_URL, HEADERS, getBody(name))
    return !!data[0]?.data?.user?.stream?.id
}