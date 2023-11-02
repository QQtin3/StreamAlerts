import {fetchGqlAPI, fetchTwitchAPIStream, fetchTwitchAPIUser, getBody} from "./twitchAPI.js";
import {createStreamerDiv} from "./popup.js";

export async function addChannel(name, streamersList) {
    let doesUserExists = await doesChannelExists(name);
    let streamerID = await getStreamerID(name);
    streamerID = parseInt(streamerID);  // Avoid comparison between int & string
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
        chrome.storage.local.set({"streamersList": streamersList});
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

export async function removeStreamer(name, streamersList) {
    let STREAMER_ID = await getStreamerID(name);
    STREAMER_ID = parseInt(STREAMER_ID);
    if (streamersList.includes(STREAMER_ID)) {
        const index =  streamersList.indexOf(STREAMER_ID)
        streamersList.splice(index, 1);
        chrome.storage.local.set({"streamersList": streamersList});
        document.getElementById(`streamer${STREAMER_ID}`).remove();
    } else {
        alert("Error 404 : Channel not found!");
    }
}