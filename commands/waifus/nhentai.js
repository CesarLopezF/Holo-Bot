module.exports = {
    name: "nh",
    category: "info",
    description: "sends a random nhentai link",
    run: async (client, interaction, args) => {
        if (interaction.channel.nsfw == true){
            search = args;
            if (search == null){
                search = Math.floor(Math.random() * 447530);
                interaction.reply("https://www.nhentai.net/g/" + search);
            } else {
                interaction.reply("https://www.nhentai.net/g/" + search);
            }
            console.log(`${interaction.user.username} has generated the saucy number ${search}`)
        } else {
            interaction.reply("Please go to a nsfw channel...");
        }
    }
}