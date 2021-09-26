var mysql = require('mysql');
const randbooru = require('megu-randbooru');
const sb = new randbooru.BooruGrabber("sfw");
const { RichEmbed } = require("discord.js");
const { titleCase } = require("title-case");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "waifus"
  });

  module.exports = {
    name: "mywaifu",
    category: "waifus",
    description: "sends an image of your waifu",
    usage: "mywaifu",
    aliases: ["mw"],
    run: async (client, message, args) => {
        var waifu;
        var sql = "SELECT waifu_name FROM waifu WHERE id_user = " + message.author.id;
        con.query(sql, function(err, result){
            message.channel.send("Out of comission");
            return;
            if(result == ""){
                 message.channel.send("You haven't registered a waifu!");
            } else{
                search = result[0].waifu_name;
                search = search.toLowerCase();
                waifu = search;
                search = search.replace(/ /g,'_');
                sb.randomImage(search)
                .then(data => {
                    var link = data.image_url.toString();
                    var embed = new RichEmbed()
                        .setColor('#DD7F3F')
                        .setDescription("Here is <@" + message.author.id + ">'s waifu " + titleCase(waifu) + "! <a:holoHappy:712807334253953094>")
                        .setImage(link)
                    message.channel.send(embed);
                }).catch(err=>{
                    message.channel.send("Sorry <@" + message.author.id + ">, no image found... <:holoThink:712812745216622594> Try something else.");
                    })
            
            }
        });
    }
}