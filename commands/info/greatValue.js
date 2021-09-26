const cheerio = require('cheerio');
const request = require('request');

module.exports = {
    name: "gv",
    category: "info",
    description: "sends a random Great Value product",
    usage: "gv",
    run: async (client, message, args) => {
            var options = {
                url: "http://results.dogpile.com/serp?qc=images&q=" + "great Value",
                method: "GET",
                headers: {
                    "Accept": "text/html",
                    "User-Agent": "Chrome"
                }
            };
        
            request(options, function(error, response, responseBody) {
                if (error) {
                    return;
                }
                $ = cheerio.load(responseBody);
                var links = $(".image a.link");
                var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
                if (!urls.length) {
                    return;
                }
                message.channel.send("Here is <@" + message.author.id + ">'s next Great Value product!");
                message.channel.send(urls[Math.floor(Math.random() * urls.length)]).then(function(message) {
                    message.react("463808579187507201")
                    message.react("689742395683897354")});
            });
        
    } 
}