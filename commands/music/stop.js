module.exports = {
    name: "stop",
    category: "music",
    description: "stops the queue and leaves voice channel",
    usage: "stop",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];

        if(!message.guild.me.voice.connection)
        {
            message.channel.send("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if (message.member.voice.channel === message.guild.voice.connection.channel)
        {
            message.channel.send("I stopped... <:holoSad:613567137801437215>");

            server.music = [];

            message.guild.voice.connection.disconnect();
        } 
        else if(message.member.voice.channel != message.guild.voice.connection.channel)
        {
            message.channel.send("We must be in the same voice channel to stop the queue!");
        }
    }
}