module.exports = {
    name: "shuffle",
    category: "music",
    description: "shuffles the queue",
    usage: "shuffle",
    run: async (client, interaction, args) => {
        var server = servers[interaction.guild.id];

        if(!interaction.member.voice.channel.id)
        {
            interaction.reply("What are you trying to do? I am not even in a voice channel... <:holoLaugh:712812696772411403>");
        }
        else if (server.player && interaction.member.voice.channel.id)
        {
            var first = server.music[0];

            server.music.shift();

            server.music.sort(song => Math.random() - 0.5);

            server.music.unshift(first);

            interaction.reply("The current queue has been shuffled")

            console.log(`${interaction.user.username} has shuffled the queue`)
        }
    }
}