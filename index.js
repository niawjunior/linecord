var request = require("request-promise");
const Discord = require("discord.js");
const bot = new Discord.Client();
const TOKEN = "discord token";

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async (msg) => {
var messageType
if (msg.author.username !== 'Line Bot') {

  if (msg.attachments.size > 0) {
    console.log(msg.attachments)
    const url = msg.attachments.map(item => {
      console.log(item)
      return item.url
    })

    messageType = {
          type: "image",
          originalContentUrl: url[0],
          previewImageUrl: url[0]
        }
      
    } else {
    messageType = {
      type: "text",
      text: `[${msg.author.username}] ${msg.content}`,
    }
  }

  const userID = 'Users ID'
  await Promise.all(
    userID.map(async (id) => {
      await request(
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer line access token",
          },
          uri: "https://api.line.me/v2/bot/message/push",
          method: "POST",
          body: JSON.stringify({
            to: id,
            messages: [
              messageType
            ]
          })
        }
      );
    })
  )
}
});


