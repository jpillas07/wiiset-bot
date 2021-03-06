const fetch = require("node-fetch");
const { Regexes } = require("../structures/Constants");

class CTGPRest {
    constructor(host) {
        this.host = host;
    }

    getEndpoint(url) {
        return fetch(url)
            .then(v => {
                if (!v.headers.get("content-type").startsWith("application/json")) {
                    throw new Error("Invalid content type received");
                }
                else return v;
            })
            .then(v => v.text())
            .then(this.removeBOM)
            .then(JSON.parse);
    }

    getTrackByEndpoint(endpoint, appendJson = true) {
        return this.getEndpoint(this.host + endpoint + (appendJson ? ".json" : ""));
    }

    getTrack(slot, hash, category) {
        return this.getTrackByEndpoint(`${slot}/${hash}/${category}`);
    }

    getRecentRecords() {
        return this.getEndpoint(`${this.host}/index.json`)
            .then(v => v.recentRecords);
    }

    getStats() {
        return this.getEndpoint(`${this.host}/index.json`)
            .then(v => ({
                uniquePlayers: v.uniquePlayers,
                leaderboardCount: v.leaderboardCount,
                ghostCount: v.ghostCount
            }));
    }

    getProfileInfo(pid) {
        return this.getEndpoint(`${this.host}/players/${pid.substr(0, 2)}/${pid.substr(2)}.json`);
    }

    getOriginalTracks() {
        return this.getEndpoint(`${this.host}/original-track-leaderboards.json`);
    }

    getCustomTracks() {
        return this.getEndpoint(`${this.host}/ctgp-leaderboards.json`);
    }

    removeBOM(str) {
        return str.replace(Regexes.BOM, "");
    }
}

module.exports = CTGPRest;