import {fetchGqlAPI, fetchTwitchAPIStream, fetchTwitchAPIUser, getBody} from "./twitchAPI.js";
import {createStreamerDiv} from "./popup.js";

export async function addChannel(name) {
    const streamersList = await getStreamersList();
    let streamerID = await getStreamerID(name);
    if (streamerID === undefined) {
        streamerID = -1;
    }
    streamerID = parseInt(streamerID);  // Avoid comparison between int & string
    if (streamersList.includes(streamerID)) {
        return {
            result: -2,
            STREAMER_ID: streamerID
        };
    } else if (streamerID === -1) {
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

export async function isOnLive(name) {
    let data = await fetchGqlAPI(getBody(name));
    return !!data[0]?.data?.user?.stream?.id;
}

async function getStreamerID(name) {
    let data = await fetchGqlAPI(getBody(name));
    return data[0]?.data?.user?.id;
}

export async function addStreamer(name) {
    const streamersList = await getStreamersList();
    const {result, STREAMER_ID} = await addChannel(name);
    if (result > 0) {
        streamersList.push(STREAMER_ID);
        chrome.storage.local.set({"streamersList": streamersList});
        const streamerData = await fetchTwitchAPIUser(streamersList);
        const streamData = await fetchTwitchAPIStream(streamersList);
        console.log(streamerData);
        console.log(streamData);
        await createStreamerDiv(streamerData, streamData, STREAMER_ID);
        console.log("\"" + name + "\" was successfully added to the streamersList." )
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

export async function removeStreamer(name) {
    const streamersList = await getStreamersList();
    let STREAMER_ID = await getStreamerID(name);
    STREAMER_ID = parseInt(STREAMER_ID);

    if (streamersList.includes(STREAMER_ID)) {
        const INDEX = streamersList.indexOf(STREAMER_ID)
        streamersList.splice(INDEX, 1);
        chrome.storage.local.set({"streamersList": streamersList});
        document.getElementById(`streamer${STREAMER_ID}`).remove();
        console.log("\"" + name + "\" was successfully removed to the streamersList." )
    } else {
        alert("Error 404 : Channel not found!");
    }
}

export async function getStreamersList() {
    return await new Promise((resolve) => {
        chrome.storage.local.get(["streamersList"], function (result) {
            resolve(result.streamersList);
        });
    });
}