module.exports = {
    name: "resume",
    aliases: ["r"],
    category: "music",
    description: "resumes a paused video",
    usage: "resume",
    run: async (client, message, args) => {
        var server = servers[message.guild.id];

        if(!message.guild.voiceConnection)
        {
            message.channel.send("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if (message.member.voiceChannel === message.guild.voiceConnection.channel)
        {
            message.channel.send("I have resumed playback!");
            message.channel.send("<a:holoHappy:712807334253953094>");
            server.dispatcher.resume();
        } else {
            message.channel.send("We must be in the same voice channel to stop the queue!");
        }
    }
}