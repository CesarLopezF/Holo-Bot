const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "help",
    category: "help",
    description: "sends a dm with help list",
    usage: "help",
    aliases: ["h"],
    run: async (client, message, args) => {
        message.channel.send("I sent you a DM! <:holoNom:712563461741215745>");

        const embed = new MessageEmbed()
            .setColor('#DD7F3F')
            .setAuthor("Hello " + message.author.username + ",", message.author.avatarURL())
            .setTitle(`These are the bot commands!`)
            .setThumbnail("https://i.imgur.com/ZIStm12.png")
            .addField("Real shit", "-b\n-nh\n-wr\n-mywaifu\n-play\n-search\n-skip\n-stop\n-queue\n-shuffle\n-move", true)

            .addField("Usage", "-b holo\n-nh / -nh 177013\n-wr holo\n-mywaifu\n-play Chase jojo 4\n-search suisei\n-skip\n-stop\n-queue\n-shuffle\n-move", true)

            .addField("Description", "Searches something in a booru\nnhentai link (nsfw channel only!)" + 
            "\nRegisters a Waifu!\nGets images from your waifu\nPlays a youtube song\nSearches for 5 youtube songs" + 
            "\nSkips the current song\nStops the queue and leave vc\nSends a list of songs in queue" + 
            "\nShuffles the current music queue\nMoves the bot to your current vc", true)
            
            .addField("Dumb shit", "nice\nanimal\ndarling\ndaga\nunlimited\nastolfo" +
            "\nfuck you\nstonks\nnot stonks\nlove\nsucc\noof")

            .setFooter("Made by Suws#6183", "https://i.imgur.com/iBYWUc2.png")
        message.author.send(embed);
    }
}