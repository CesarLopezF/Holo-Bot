module.exports = {
    name: "skip",
    category: "help",
    description: "skips the current video",
    usage: "skip",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];
        if (!message.guild.voiceConnection)
        {
            message.channel.send("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if(message.member.voiceChannel != message.guild.voiceConnection.channel)
        {
            message.channel.send("We must be in the same voice channel!");
        }
        else if(server.dispatcher && message.member.voiceChannel === message.guild.voiceConnection.channel)
        {
            server.dispatcher.end();
        }
    }
}