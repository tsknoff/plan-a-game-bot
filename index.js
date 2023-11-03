const TelegramApi = require("node-telegram-bot-api");

const token = "6748663808:AAHKHhEy-HLKj5U9zeF_RDvtNL1WU1TLUus";

const bot = new TelegramApi(token, { polling: true });

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (text === "/start") {
    bot.sendMessage(chatId, `Hello ${msg.from.first_name}`);
  } else if (text === "/info") {
    bot.sendMessage(chatId, `You are ${msg.from.username}`);
  } else if (text === "/help") {
    bot.sendMessage(chatId, `How can I help you?`);
  } else {
    bot.sendMessage(chatId, `I don't understand you`);
  }
});
