const { titleCase } = require("title-case");
var mysql = require('mysql');
var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "waifus"
    });

module.exports = {
    name: "waifuregister",
    category: "waifus",
    description: "register your waifu",
    usage: "waifuregister",
    aliases: ["wr"],
    run: async (client, message, args) => {
        message.channel.send("Out of comission");
        return;
        mensaje = message.content.toString().split( "-wr ");
        waifu = mensaje[1];
        if (waifu)
        {
            var sql = "INSERT INTO waifu (id_user, waifu_name) VALUES ('"+message.author.id+"', '"+ waifu +"') ON DUPLICATE KEY UPDATE waifu_name = '" + waifu + "'";
            con.query(sql, function (err, result) {
            message.channel.send("Your waifu is " + titleCase(waifu));
            });
            
        } else {
            message.channel.send("Please register a waifu!");
        }
    }
}