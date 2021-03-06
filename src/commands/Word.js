module.exports = {
    name: "word",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Sends a random word in this channel"
    },
    run: async (context) => {
        const messages = await context.rest.fetchMessages(context.channelId);
        const arr = [...messages.values()].map(v => v.content.split(" ")).reduce((a, b) => a.concat(b));
        return [arr[Math.floor(Math.random() * messages.size)]];
    }
};