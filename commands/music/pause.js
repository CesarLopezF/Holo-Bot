module.exports = {
    name: "pause",
    aliases: ["p"],
    category: "music",
    description: "pauses current video",
    usage: "pause",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];

        if(!message.guild.voiceConnection)
        {
            message.channel.send("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if (message.member.voiceChannel === message.guild.voiceConnection.channel)
        {
            message.channel.send("I have paused playback!");
            server.dispatcher.pause();
        } else {
            message.channel.send("We must be in the same voice channel to stop the queue!");
        }
    }
}