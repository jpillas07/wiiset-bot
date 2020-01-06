function handle(resolve, reject, amount, err) {
    if (err) return reject(err);
    resolve([{
        embed: {
            color: 0x77b254,
            description: "Lick User",
            fields: [
                {
                    name: "Total licks",
                    value: `${amount} licks`
                }
            ]
        }
    }]);
}

module.exports = {
    name: "lick",
    ownerOnly: false,
    guildOnly: false,
    run: async (context) => {
        return new Promise((resolve, reject) => {
            const { mentions } = context.message;
            if (mentions.size === 0) reject(["User not found"]);
            context.pool.query("SELECT amount FROM licks WHERE author = $1", [mentions.first().id], (_, res) => {
                if (res.rowCount === 0) {
                    context.pool.query("INSERT INTO licks (\"author\", \"amount\") VALUES ($1, 1)", [mentions.first().id], handle.bind(null, resolve, reject, 1));
                } else {
                    context.pool.query("UPDATE licks SET amount = amount + 1 WHERE author = $1", [mentions.first().id], handle.bind(null, resolve, reject, res.rows[0].amount));
                }
            });
        });
    }
};