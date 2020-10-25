const functions = require("firebase-functions");
const request = require("request-promise");
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer line access token",
};
// const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";

const LINE_CHANNEL_SECRET = "line channel secret";

const crypto = require("crypto");

exports.webhook = functions.https.onRequest(async (req, res) => {
  if (req.method === "POST") {
    const text = JSON.stringify(req.body);

    const signature = crypto
      .createHmac("SHA256", LINE_CHANNEL_SECRET)
      .update(text)
      .digest("base64")
      .toString();

    if (signature !== req.headers["x-line-signature"]) {
      return res.status(401).send("Unauthorized");
    }
    await reply(req.body);
  }
  return res.status(200).send(req.method);
});

const reply = async (bodyPayload) => {
  try {
    console.log(bodyPayload.events[0])
    const user = await request.get({
      uri: `https://api.line.me/v2/bot/profile/${bodyPayload.events[0].source.userId}`,
      headers: LINE_HEADER,
    });

    await request.post({
      uri:
        "discord webhook url",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: JSON.parse(user).displayName,
        avatar_url: JSON.parse(user).pictureUrl,
        content: `[${JSON.parse(user).displayName}] ${
          bodyPayload.events[0].message.text
        }`,
      }),
    });

    // await request.post({
    //   uri: `${LINE_MESSAGING_API}/reply`,
    //   headers: LINE_HEADER,
    //   body: JSON.stringify({
    //     replyToken: bodyPayload.events[0].replyToken,
    //     messages: [
    //       {
    //         type: "text",
    //         text: `ส่งข้อความแล้วครับ คุณ ${JSON.parse(user).displayName} (${JSON.stringify(images)})`,
    //       },
    //     ],
    //   }),
    // });
  } catch (e) {}
};
