const { RichEmbed } = require("discord.js");
const { promptMessage } = require("./functions.js");

const chooseArr = ["🗻", "📰", "✂"];

module.exports = {
    name: "rps",
    category: "games",
    description: "Rock Paper Scissors game. React to one of the emojis to play the game.",
    usage: "rps",
    run: async (client, message, args) => {
        const embed = new RichEmbed()
            .setColor("#DD7F3F")
            .setTitle("JanKenPon!")

        const m = await message.channel.send(embed);
        // Wait for a reaction to be added
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        // Get a random emoji from the array
        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        // Check if it's a win/tie/loss
        const result = await getResult(reacted, botChoice);
        var mensaje;
        // Clear the reactions
        await m.clearReactions();
        
        embed
            .setDescription("Jan");
        m.edit(embed);
        await m.clearReactions();

        embed
            .setDescription("Ken...");
        m.edit(embed);
        await m.clearReactions();

        embed
            .setDescription("PON!");
        m.edit(embed);
        await m.clearReactions();

        if (result === "It's a tie!"){
            mensaje = "I'd say we did good <@" + message.author.id + "> <:putin:638847899869904906>";
        } else if (result === "You lost!"){
            mensaje = "Don't mess with a Wise Wolf <@" + message.author.id + "> <:holoSmug:712812730410598400>";
        } else if (result === "You won!"){
            mensaje = "You win this time <@" + message.author.id + ">... <:holoSad:613567137801437215>";
        }

        embed
            .setTitle("Results:")
            .setDescription(`${reacted} vs ${botChoice}`)
            .addField(result, mensaje)
        
        m.edit(embed);

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📰" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📰")) {
                    return "You won!";
            } else if (me === clientChosen) {
                return "It's a tie!";
            } else {
                return "You lost!";
            }
        }
    }
}