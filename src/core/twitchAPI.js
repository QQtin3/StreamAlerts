const API_URL = `https://gql.twitch.tv/gql`;
const HEADERS = {
    'Client-Id': "kimne78kx3ncx6brgo4mv6wki5h1ko",
    'Client-Session-Id': "dbbc595729568658",
    'Client-Version': "51d9bb9b-ddab-49c5-9fb6-b236934f29e8",
    'X-Device-Id': "gRLPoKwJ2EAegIGiWJEIhk6HdzQ47S4J"
};

function getBody(nickname) {
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

async function fetchTwitchAPI(url, header, body) {
    let data = await fetch(
        url, {
            method: "POST",
            headers: header,
            body: body
        })
    return data.json();
}

export {
    API_URL,
    HEADERS,
    getBody,
    fetchTwitchAPI
}