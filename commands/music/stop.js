module.exports = {
    name: "stop",
    category: "music",
    description: "stops the queue and leaves voice channel",
    usage: "stop",
    run: async (client, interaction, args) => {

        var server = servers[interaction.guild.id];

        if(!interaction.member.voice.channel.id)
        {
            interaction.reply("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if (server.player && interaction.member.voice.channel.id)
        {
            interaction.reply(`${interaction.user.username} has stopped the queue... <:holoSad:613567137801437215>`);

            console.log(`${interaction.user.username} has stopped the queue`);

            server.music = [];

            server.connection.destroy();
        }
    }
}