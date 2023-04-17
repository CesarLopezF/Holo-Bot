const ytsr = require('ytsr')
const { ActionRowBuilder, Events, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const play = require("./play");

module.exports = {
    name: "search",
    category: "search",
    description: "searches a youtube video",
    usage: "search",
    run: async (client, interaction, args) => {

        if(!args) {
            interaction.reply('Please add a search') 
            return
        }

        var filters = await ytsr.getFilters(args);
        filter = filters.get('Type').get('Video')

        console.log(`${interaction.user.username} has searched for ${args}`)

        ytsr(filter.url, {limit: 20}).then(async r => {

            let videos = r.items

            var options = []
            var i = 1

            videos.forEach(video => {
                if(video.title.length > 100) return;
                if(!video.bestThumbnail) return;
                options.push({id: video.id, url: video.url, title: video.title, author: interaction.user.id, duration: video.duration, thumbnail: video.bestThumbnail.url, videoAuthor: video.author.name, videoAuthorUrl: video.author.url, interaction})
                i++
            })

            const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Select the song to add into queue')
					.addOptions(options.map(option => { return { label: option.title, value: option.id }})),
			);

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
            )
            const sentMessage = await interaction.reply({components: [row, button]})

            client.on(Events.InteractionCreate, async inter => {
                if (inter.isStringSelectMenu() && interaction.user.id === inter.user.id)
                {

                    const selected = inter.values[0];

                    const found = options.findIndex(option => option.id == selected)

                    row.components[0].setDisabled(true)
                    await inter.update({contents:`${options[found].title} has been selected!`, components: [row]});
                    play.Add(options[found].url, options[found].title, options[found].author, options[found].duration, options[found].thumbnail, options[found].videoAuthor, options[found].videoAuthorUrl, inter, client)
                }
                
                else if (inter.isButton() && interaction.user.id === inter.user.id && inter.customId == 'cancel')
                {
                    console.log(`${inter.user.username} has cancelled the search`)
                    row.components[0].setDisabled(true)
                    await sentMessage.edit({components: [row]})
                    await inter.update(`The search has been cancelled!`);
                }
            });
        })
    }
}
