module.exports = {
    name: "stop",
    category: "music",
    description: "stops the queue and leaves voice channel",
    usage: "stop",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];

        if(!message.guild.voiceConnection)
        {
            message.channel.send("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if (message.member.voiceChannel === message.guild.voiceConnection.channel)
        {
            message.channel.send("I stopped... <:holoSad:613567137801437215>");
            server.queue = [];
            message.guild.voiceConnection.disconnect();
        } 
        else if(message.member.voiceChannel != message.guild.voiceConnection.channel)
        {
            message.channel.send("We must be in the same voice channel to stop the queue!");
        }
    }
}