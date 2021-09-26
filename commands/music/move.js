module.exports = {
    name: "move",
    category: "music",
    description: "moves the bot to another voice channel",
    usage: "move",
    run: async (client, message, args) => {
        if(!message.member.voiceChannel){
            message.channel.send("You must be in a voice channel!");
        }
        else if(!message.guild.voiceConnection)
        {
            message.channel.send("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if(message.member.voiceChannel != message.guild.voiceConnection.channel)
        {
            message.member.voiceChannel.join();
            message.channel.send("I have joined your voice channel!");
            message.channel.send("<a:holoHappy:712807334253953094>");
        }
        else 
        {
            message.channel.send("I am already in your voice channel... <:holoNom:712563461741215745>");
        }
    }
}