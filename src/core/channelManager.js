import {fetchGqlAPI, fetchTwitchAPIStream, fetchTwitchAPIUser, getBody} from "./twitchAPI.js";
import {createStreamerDiv} from "./popup.js";

export async function addChannel(name, streamersList) {
    let twitchChannelURL = `https://www.twitch.tv/${name}`;
    let doesUserExists = await doesChannelExists(name);
    if (streamersList.includes(name)) {
        return -2;
    } else if (!doesUserExists) {
        return -1;
    } else {
        return 1;
    }
}

export async function doesChannelExists(name) {
    let data = await fetchGqlAPI(getBody(name));
    return !!data[0]?.data?.user;
}

export async function isOnLive(name) {
    let data = await fetchGqlAPI(getBody(name))
    return !!data[0]?.data?.user?.stream?.id
}

export async function addStreamer(name, streamersList) {
    let resultChannel = await addChannel(name, streamersList);
    if (resultChannel > 0) {
        const index = streamersList.length;
        streamersList.push(name);
        const streamerData = await fetchTwitchAPIUser(streamersList);
        const streamData = await fetchTwitchAPIStream(streamersList);
        await createStreamerDiv(streamerData, streamData, index);
    }
    switch (resultChannel) {
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