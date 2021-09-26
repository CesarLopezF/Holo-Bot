const yts = require("yt-search");
module.exports = {
    name: "ytr",
    category: "yt",
    description: "searches a random youtube video",
    usage: "ytr",
    run: async (client, message, args) => {

        mensaje = message.content.toString().split( "-ytr ");
        mensaje = mensaje[1];

        yts(mensaje, function ( err, r ) {
            let youtube = r.videos[Math.floor(Math.random() * 20)]
            message.channel.send(youtube.url);
        })
    }
}