const {fetchTwitchAPI, API_URL, HEADERS, BODY} = require("../../background.js");

async function addChannel(name) {
    let twitchChannelURL = `https://www.twitch.tv/${name}`;
    let doesUserExists = await doesChannelExists(twitchChannelURL);
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

async function doesChannelExists(twitchChannelURL) {
    let data = await fetchTwitchAPI(API_URL, HEADERS, BODY);
    return !!data[0]?.data?.user;
}

async function isPartner(twitchChannelURL) {
}

module.exports = {
    addChannel: addChannel,
};