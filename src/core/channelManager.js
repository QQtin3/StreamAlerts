import {API_URL, fetchTwitchAPI, getBody, HEADERS} from "./twitchAPI.js";

export async function addChannel(name) {
    let twitchChannelURL = `https://www.twitch.tv/${name}`;
    let doesUserExists = await doesChannelExists(name);
    if (!doesUserExists) {
        return -1;
    } else {
        if (await isPartner(twitchChannelURL)) {
            return 2;
        } else {
            return 1;
        }
    }
}

export async function doesChannelExists(name) {
    console.log("NAME : " + name);
    let data = await fetchTwitchAPI(API_URL, HEADERS, getBody(name));
    console.log("DATA : " + !!data[0]?.data?.user);
    return !!data[0]?.data?.user;
}

export async function isPartner(twitchChannelURL) {
}