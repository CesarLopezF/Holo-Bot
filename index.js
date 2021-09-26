const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");

const client = new Client({
    disableEveryone: false
});

global.servers = {};

token = "Njg5MDM1MjI1OTc5ODEzODk0.Xm9LtQ.aJEf9Y6ZD9X-aoDfsF017hbnxqc";

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);
    client.user.setPresence({
        status: "online",
        game: {
            name: "with apples 🍎"
        }
    });
});

client.on("message", async message => {
    const prefix = "-";
    
    if (message.author.bot) return;
    if (!message.guild) return;
    
    if(message.content.toLowerCase().includes("fuck you")){
        message.channel.send("FAKAA YOU <:angry:691582873177686026>");
    }

    if(message.content.toLowerCase() == "oof"){
        message.channel.send("That's a big oof");
    }

    if(message.content.toLowerCase().includes("quiero morir")){
        message.channel.send("🎵 Quiero morir, quiero matarme! 🎵");
        message.channel.send("🎵 Yo solo quiero SUICIDARME! 🎵");
    }
    
    if(message.content.toLowerCase().includes("not stonks")){
        message.channel.send("https://tenor.com/view/not-stonks-profit-down-sad-frown-arms-crossed-gif-15684535");
    } else if(message.content.toLowerCase().includes("stonks")){
        message.channel.send("https://tenor.com/view/stonks-up-stongs-meme-stocks-gif-15715298");
    }

    if(message.content.toLowerCase().startsWith("solo ")){
        message.channel.send("<:4head:632858961804263424>");
    }

    if(message.content.toLowerCase().startsWith("4h")){
        message.channel.send("<:4head:632858961804263424>");
    }
    
    if(message.content.toLowerCase().includes("fuck off") && message.author.id == "180499460642570240"){
        message.channel.send("Ye, fuck off <:holoSmug:712919248586014740>");
    }

    if(message.content.toLowerCase().includes("succ")){
        message.channel.send("https://tenor.com/view/astolfo-plushy-gif-13306557");
    }

    if(message.content.toLowerCase() == "daga"){
        const daga = ["kotowaru" , "otoko da"];
        const choice = daga[Math.floor(Math.random() * daga.length)];
        var length = choice.length;
        message.channel.send(choice);
        if (choice == "kotowaru"){
            message.channel.send("https://tenor.com/view/rohan-jjba-daga-kotowaru-irefuse-refuse-gif-7385649");
        }else if (choice == "otoko da"){
            message.channel.send("https://tenor.com/view/ruka-steins-gate-otoko-gif-5659410").then(function(message) {
                message.react("463808579187507201")});
        }
    }

    if(message.content.toLowerCase() == "unlimited"){
        const unlimited = ["9 lives " , "rulebook", "gameplay", "blade works", "power ", "<:quiubo:561769076184317972>", "budget works", "bath", "O~chinchin"];
        var choice = unlimited[Math.floor(Math.random() * unlimited.length)];
        var length = choice.length;
        if (choice == "<:quiubo:561769076184317972>"){
            length = 3;
        } else if(choice == "9 lives "){
            length = 6;
        } else if (choice == "power "){
            length = 6;
        }
        for (length; length <= 12; length++){
            choice += "  ";
        }
        message.channel.send("||" + choice + "||");
    }

    if(message.content.toLowerCase() == "love"){
        message.channel.send("Ai... rabu... yu!");
        message.channel.send("https://tenor.com/view/ilove-you-anime-golden-time-kaga-kouko-kouko-kaga-gif-13405127").then(function(message) {
            message.react("691575531128356914")});
    }

    if(message.content.toLowerCase() == "darling"){
        message.channel.send("Ha ba ba... Ha babadegada.. Hababadadeba <:ButIWant:689742395683897354>");
        message.channel.send("https://tenor.com/view/darling-in-the-franxx-excited-angry-mad-pissed-gif-12295839").then(function(message) {
            message.react("689742395683897354")
            message.react("683565194680598531")});
    }

    if(message.content == "<:holoSleepy:612894366041899009>"){
        message.channel.send("<:holoSleepy:612894366041899009>");
    }
    if(message.content.includes("<:holoLove:691575531128356914>")){ 
        message.channel.send("<:holoLove:691575531128356914>");
    }
    if (message.content.includes("<:holoDrink:632869932928860160>")){
        message.channel.send("https://tenor.com/view/holo-enos_n-spice-and-wolf-holo-the-wisewolf-anime-gif-14248698")
    }

    if(message.content.toLowerCase() == "animal"){
        message.channel.send("動物 Ee");
    }

    if(message.content.toLowerCase().includes("nice")){
        message.channel.send("NICE NICE NICE NICE NICE NICE NICE");
    }

    if(message.content.toLowerCase() == "mi bb" || message.content.toLowerCase() == "astolfo"){
        await message.channel.send({files: ['https://cdn.discordapp.com/attachments/222075405056737282/473176308025786420/T1.png']});
        await message.channel.send({files: ['https://cdn.discordapp.com/attachments/222075405056737282/473176314250002432/T2.png']});
        await message.channel.send({files: ['https://cdn.discordapp.com/attachments/222075405056737282/473176316615852071/T3.png']});
        await message.channel.send({files: ['https://cdn.discordapp.com/attachments/222075405056737282/473176321527250954/T4.png']});
    }
    
    if (!message.content.startsWith(prefix)) return;

    if (!servers[message.guild.id])
    {
        servers[message.guild.id] = {queue: [], queueTitle: [], queueThumbnail: [], queueTime: [], queueRequestor: [], queueAdded: [], links: []}
    }

    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);

});

client.login(token);