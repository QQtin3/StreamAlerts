import {fetchGqlAPI, fetchTwitchAPIStream, fetchTwitchAPIUser, getBody} from "./twitchAPI.js";
import {createStreamerDiv} from "./popup.js";

export async function addChannel(name, streamersList) {
    let doesUserExists = await doesChannelExists(name);
    let streamerID = await getStreamerID(name);
    if (streamersList.includes(streamerID)) {
        return {
            result: -2,
            STREAMER_ID: streamerID
        };
    } else if (!doesUserExists) {
        return {
            result: -1,
            STREAMER_ID: streamerID
        };
    } else {
        return {
            result: 1,
            STREAMER_ID: streamerID
        };
    }
}

export async function doesChannelExists(name) {
    let data = await fetchGqlAPI(getBody(name));
    return !!data[0]?.data?.user;
}

export async function isOnLive(name) {
    let data = await fetchGqlAPI(getBody(name));
    return !!data[0]?.data?.user?.stream?.id;
}

async function getStreamerID(name) {
    let data = await fetchGqlAPI(getBody(name));
    return data[0]?.data?.user?.id;
}

export async function addStreamer(name, streamersList) {
    const {result, STREAMER_ID} = await addChannel(name, streamersList);
    console.log("result: " + result);
    if (result > 0) {
        streamersList.push(STREAMER_ID);
        const streamerData = await fetchTwitchAPIUser(streamersList);
        const streamData = await fetchTwitchAPIStream(streamersList);
        await createStreamerDiv(streamerData, streamData, STREAMER_ID);
    }

    switch (result) {
        case -2:
            alert(`Value error : ${name} is already in the list!`);
            break;

        case -1:
            alert("Error 404 : Channel not found!");
            break;
    }
}

export function removeStreamer(name, streamersList) {
    let index = streamersList.indexOf(name);
    if (index !== -1) {
        streamersList.slice(0, -1);
        document.getElementById(`streamer${index}`).remove();
    } else {
        alert("Error 404 : Channel not found!");
    }
}