module.exports = {
    name: "shuffle",
    category: "music",
    description: "shuffles the queue",
    usage: "shuffle",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];

        if(!message.guild.me.voice.connection)
        {
            message.channel.send("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if (message.member.voice.channel === message.guild.voice.connection.channel)
        {
            var first = server.music[0];

            server.music.shift();

            server.music.sort(song => Math.random() - 0.5);

            server.music.unshift(first);

            message.channel.send("The current music queue has been shuffled")
        } 
        else if(message.member.voice.channel != message.guild.voice.connection.channel)
        {
            message.channel.send("We must be in the same voice channel to stop the queue!");
        }
    }
}