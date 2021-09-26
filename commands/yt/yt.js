const yts = require("yt-search");
module.exports = {
    name: "yt",
    category: "yt",
    description: "searches a youtube video",
    usage: "yt",
    run: async (client, message, args) => {

        mensaje = message.content.toString().split( "-yt ");
        mensaje = mensaje[1];

        yts(mensaje, function ( err, r ) {
            let youtube = r.videos[0]
            message.channel.send(youtube.url);
        })
    }
}