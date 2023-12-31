import {fetchTwitchAPIStream, fetchTwitchAPIUser} from "./twitchAPI.js";
import {createStreamerDiv} from "./popup.js";

/**
 * Required for addStreamer, check if the input corresponds to a streamer that exists and is not already in the list.
 *
 * @param name Streamer's name
 * @return {result, STREAMER_ID} result & STREAMER_ID both int
 */
export async function addChannel(name) {
    const streamersList = await getStreamersList();
    let streamerID = await getStreamerID(name);

    if (streamerID === undefined) {  // Checks if streamer exists (-1 means not found)
        return {
            result: -1,
            STREAMER_ID: streamerID
        };
    } else if (streamersList.includes(streamerID)) {  // Checks if is not already in the list
        return {
            result: -2,
            STREAMER_ID: streamerID
        };
    } else {
        return {
            result: 1,
            STREAMER_ID: streamerID
        };
    }
}

/**
 * Get a streamer ID from their name and return it.
 *
 * @param name Streamer's name
 * @return result Streamer's ID if they exist (int), else undefined
 */
async function getStreamerID(name) {
    let loginName = name.toLowerCase()
    let data = await fetchTwitchAPIUser([loginName], "login");

    let result;
    if (data[loginName].id === null) {
        result = undefined;
    } else {
        result = parseInt(data[loginName].id);
    }
    return result;
}

/**
 * Add a streamer to the streamersList and add their div-box on the popup.
 *
 * @param name Streamer's name that is going to be added to the list
 */
export async function addStreamer(name) {
    const streamersList = await getStreamersList();
    const {result, STREAMER_ID} = await addChannel(name);
    if (result === 1) {
        streamersList.push(STREAMER_ID);
        chrome.storage.sync.set({"streamersList": streamersList});

        const streamerData = await fetchTwitchAPIUser(streamersList);
        const streamData = await fetchTwitchAPIStream(streamersList);

        let streamsStatus = await getStreamsStatus();
        streamsStatus[STREAMER_ID] = {status: 0, notifHasBeenSent: 0};
        chrome.storage.sync.set({"streamsStatus": streamsStatus});

        await createStreamerDiv(streamerData, streamData, STREAMER_ID);
        console.log("\"" + name + "\" was successfully added to the streamersList.")
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

/**
 * Remove a streamer from the streamersList and remove their div-box on the popup.
 *
 * @param name Streamer's name that is going to be removed from the list
 */
export async function removeStreamer(name) {
    const streamersList = await getStreamersList();
    const STREAMER_ID = await getStreamerID(name);

    if (streamersList.includes(STREAMER_ID)) {
        const INDEX = streamersList.indexOf(STREAMER_ID)
        streamersList.splice(INDEX, 1);
        chrome.storage.sync.set({"streamersList": streamersList});

        let streamsStatus = await getStreamsStatus();
        delete streamsStatus[STREAMER_ID];
        chrome.storage.sync.set({"streamsStatus": streamsStatus});

        document.getElementById(`streamer${STREAMER_ID}`).remove();
        console.log("\"" + name + "\" was successfully removed from the streamersList.")
    } else {
        alert("Error 404 : Channel not found!");
    }
}

/**
 * Get and returns the User's streamersList using 'chrome.storage' API
 * (please refer to the official API for more details about it).
 *
 * @return Array fulfilled with Streamer(s) ID, if none exists, creates an empty one
 */
export async function getStreamersList() {
    let streamersList = await new Promise((resolve) => {
        chrome.storage.sync.get(["streamersList"], function (result) {
            resolve(result.streamersList);
        });
    });

    if (streamersList === undefined) {
        streamersList = [];
        chrome.storage.sync.set({"streamersList": []});
    }
    return streamersList;
}

/**
 * Get and returns the Streams's status using 'chrome.storage' API
 * (please refer to the official API for more details about it).
 *
 * @return Object fulfilled with: id {status, hasNotificationBeenSent} if none exists, creates an empty one
 */
export async function getStreamsStatus() {
    let streamsStatus = await new Promise((resolve) => {
        chrome.storage.sync.get(["streamsStatus"], function (result) {
            resolve(result.streamsStatus);
        });
    });
    if (streamsStatus === undefined) {
        streamsStatus = {};
        chrome.storage.sync.set({"streamsStatus": {}});
    }
    return streamsStatus;
}