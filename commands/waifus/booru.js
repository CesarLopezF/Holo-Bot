const randbooru = require('megu-randbooru');
const sb = new randbooru.BooruGrabber("sfw");
const gb = new randbooru.BooruGrabber("nsfw");
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "b",
    category: "waifus",
    description: "sends a random image from a selected waifu",
    usage: "b",
    run: async (client, message, args) => {
        message.channel.send("Out of comission");
        return;
        mensaje = message.content.toString().split( "-b ");
        search = mensaje[1];
        if (search){
            search = search.toLowerCase();
            search = search.replace(/ /g,'_');
            search = search.replace(/,/g," ");
            booru(message, search);
        } else {
            booru(message,"*")
        }
    }
}
var banned = ["kraken","ridley","mutilation","vore","birth","dissection","okami","furry","scaly","insect","poop",
            "maggots","organs","fungus","yiff","saw","body_parts","amputation"];

function booru(message, search){
    if(message.channel.nsfw == true)
    {
        banCheck = search.split(" ");
        if(search.includes("holo") || search.includes("spice_and_wolf") || search.includes("craft_lawrence"))
        {
            message.channel.send("Dont lewd the wisewolf! <:holoMad:712812710248579132>");
        }
        else if(search.includes("samus_aran"))
        {
            message.channel.send("No.");
            message.channel.send("<:ya:691580710724567130>");
        }
        else if(banned.some(item => banCheck.includes(item)))
        {
            message.channel.send("You disgust me.");
            message.channel.send("<:disgustedTanjiro:623988992999817231>")
        }
        else
        {
            search = search + " rating:explicit"
            gb.randomImage(search)
            .then(data => {
                var link = data.image_url.toString();
                var tags = data.tags.toString();
                var source = data.source.toString();
                var embed = new RichEmbed()
                    .setColor('#DD7F3F')
                    .setDescription("I see <@" + message.author.id + "> is a degenerate of culture as well <:holoUwU:712812730410598400>")
                    .addField("Tags", tags)
                if(source)
                {
                    embed = new RichEmbed(embed)
                        .addField("Sauce", source)
                }
                    
                if(link.includes(".webm"))
                {
                    message.channel.send(embed);
                    message.channel.send(link);
                } 
                else 
                {
                    var embed = new RichEmbed(embed)
                        .setImage(link)
                    message.channel.send(embed);
                }
            }).catch(err=>{
                message.channel.send("Sorry <@" + message.author.id + ">, no image found... <:holoThink:712812745216622594> Try something else!");
            })
        }
    }
    else 
    {
        sb.randomImage(search)
        .then(data => {
            var link = data.image_url.toString();
            if(link.includes(".webm"))
            {
                message.channel.send("I see <@" + message.author.id + "> is a man of culture as well <:holoUwU:712812730410598400>\n"+link)
            } 
            else 
            {
                var embed = new RichEmbed()
                    .setColor('#DD7F3F')
                    .setDescription("I see <@" + message.author.id + "> is a man of culture as well <:holoUwU:712812730410598400>")
                    .setImage(link)
                message.channel.send(embed)
            }
        }).catch(err=>{
        message.channel.send("Sorry <@" + message.author.id + ">, no image found... <:holoThink:712812745216622594> Try something else.");
        })
    }
}
