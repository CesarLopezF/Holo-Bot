const { Client, Collection, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { config } = require("dotenv");
const fs = require("fs");
const spawn = require("child_process").spawn;
require('log-timestamp')(function() { return '[' + new Date().toLocaleString() + ']' });

var latestTweets = require('latest-tweets')

token = "";
clientID = '689035225979813894'
 
//sudo npm install --unsafe-perm ffmpeg-static

const client = new Client({ 
    intents: [
		GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
	],
});

const commands = [
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from youtube')
        .addStringOption(option =>
            option.setName('search')
                .setDescription('Song to search')
                .setRequired(true)
            )
    , new SlashCommandBuilder()
        .setName('search')
        .setDescription('Searches for a youtube song')
        .addStringOption(option =>
            option.setName('search')
                .setDescription('Video to search')
                .setRequired(true)
            )
    , new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Sends the current queue')
    , new SlashCommandBuilder()
        .setName('nh')
        .setDescription('Returns an either random or searched for lucky number')
        .addStringOption(option =>
            option.setName('search')
                .setDescription('Number to search')
            )
  ];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
  
      await rest.put(Routes.applicationCommands(clientID), { body: commands });

    } catch (error) {
      console.error(error);
    }
  })();

global.servers = {};

client.commands = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", async () => {
    console.log(`Hi, ${client.user.username} is now online!`);
    client.user.setPresence({
        status: "online",
        game: {
            name: "with apples 🍎"
        }
    });

    checkDay()

});

client.on("interactionCreate", async interaction =>
{
    if (!interaction.isChatInputCommand()) return;

    if (!servers[interaction.guild.id])
    {
        servers[interaction.guild.id] = {music: {url, title, thumbnail, timestamp, author, added, authorName, authorUrl} = []}
    }
    
    let command = client.commands.get(interaction.commandName);

    if (command) 
        command.run(client, interaction, interaction.options.getString('search'));

});

async function checkDay()
{
    today = new Date().getDay()

    if(today != 4) return

    const pythonProcess = spawn('python',["./commands/py/yt.py"]);

    pythonProcess.stdout.on('data', (data) => {
        client.channels.fetch('466865681766416385').then(channel => {
            channel.messages.fetch({limit: 100}).then(messages => {
                var messageList = []
                var videoId = data.toString().split('\n')[0]
                var videoLink = `https://youtu.be/${videoId}`.substring(0, `https://youtu.be/${videoId}`.length-1)
                messages.forEach(message => messageList.push(message.content) )
                if(messageList.indexOf(videoLink) == -1) channel.send(`https://youtu.be/${data.toString()}`)
            })
        })
    });

    
}


client.login(token);