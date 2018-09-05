const fetch = require("node-fetch");
const controllerCodes = require("../../controllerCodes.json");
const countryCodes = require("../../countryCodes.json");

module.exports = async message => {
    try {
        if (message.args.length == 1) return message.reply("No player ID provided. To get someone's player ID, you visit their profile by using the search bar at <http://chadsoft.co.uk/time-trials/players.html>. The player ID should be displayed on their profile.");
        if (message.args.length < 2) return message.reply("No player ID provided."); // TODO: if profile id of author is saved in db, use that
        if (message.mentions.users.size === 0) {
            if (!/[A-Z0-9]+/.test(message.args[1])) return message.reply("invalid player ID format.");
            let request = await fetch(`http://tt.chadsoft.co.uk/players/${message.args[1].substr(0, 2)}/${message.args[1].substr(2)}.json`);
            let result = await request.text();
            if (request.headers.raw()["content-type"][0] !== "application/json") return message.reply("An invalid profile ID was provided. "); // if result is not an object
            result = JSON.parse(result.replace(/^\s*/g, ""));
            let embedColor;
            switch (Object.entries(result.stars).sort((a, b) => a[1] < b[1])[0][0]) {
                case "bronze":
                    embedColor = 0xCD7F32;
                    break;
                case "silver":
                    embedColor = 0xC0C0C0;
                    break;
                case "gold":
                    embedColor = 0xD4AF37;
                    break;
            }
            message.channel.send({
                embed: {
                    title: "Time Trial information about " + result.miiName,
                    color: embedColor,
                    description: "USB GCN Adapter attached: " + (result.usbGcnAdapterAttached ? "yes" : "no") + "\n" +
                        "Controller: " + (controllerCodes[result.controller] || "unknown") + "\n" +
                        "Country: " + (countryCodes[result.country] || "unknown"),
                    fields: [{
                            name: "Stars",
                            value: `${result.stars.bronze} Bronze\n${result.stars.silver} Silver\n${result.stars.gold} Gold`
                        },
                        {
                            name: "Last 5 out of " + (result.miiNames.length < 5 ? "<5" : result.miiNames.length - 5) + " Mii names",
                            value: result.miiNames.slice(0, 5).map(e => "`" + e + "`").join(", ")
                        },
                        {
                            name: "Submitted ghosts",
                            value: result.ghostCount
                        },
                        {
                            name: "Ghosts",
                            value: result.ghosts.slice(0, 5).map(e => e.trackName + ": " + e.finishTimeSimple).join("\n") + (result.ghosts.length > 4 ? "\n... and " + (result.ghosts.length - 5) + " more. (" + result.ghosts.length + " total ghosts)" : "")
                        }
                    ]
                }
            });
        } else {
            // TODO: let users store their profile id into a database and use mentions instead
        }
    } catch (e) {
        message.reply("An error occured while executing the command.");
    }
}