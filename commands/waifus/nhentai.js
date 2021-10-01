module.exports = {
    name: "nhentai",
    category: "info",
    description: "sends a random nhentai link",
    usage: "nhentai",
    aliases: ["nh"],
    run: async (client, message, args) => {
        if (message.channel.nsfw == true){
            mensaje = message.content.toString().split( "-nh ");
            search = mensaje[1];
            if (search == null){
                randSauce = Math.floor(Math.random() * 374496);
                message.channel.send("https://www.nhentai.net/g/" + randSauce);
            } else {
                message.channel.send("https://www.nhentai.net/g/" + search);
            }
        } else {
            message.channel.send("Please go to a nsfw channel...");
        }
    }
}