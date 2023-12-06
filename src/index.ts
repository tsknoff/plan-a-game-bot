import TelegramApi = require("node-telegram-bot-api");
import { PlanGame } from "./PlanGame";
import { lookCallback } from "./callbacks/lookCallback";
import { joinCallback } from "./callbacks/joinCallback";
import { sequelize } from "./db";
import * as dotenv from "dotenv";
import { groupCommands } from "./commands/group";
import { privateCommands } from "./commands/private";
import { cancelCallback } from "./callbacks/cancelCallback";
dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramApi(token, {
  polling: true,
});

const startBot = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (e) {
    console.log("Ошибка при подключении к БД", e);
  }

  const planGame = new PlanGame();

  bot.on("message", async (msg) => {
    const isGroup = msg.chat.id.toString().startsWith("-");

    await bot.setMyCommands([
      { command: "/start", description: "Как пользоваться ботом" },
    ]);

    try {
      // Если сообщение пришло из группового чата
      if (isGroup) {
        switch (msg.text) {
          case "/start@PlanGameBot":
          case "/start":
            return groupCommands.start(bot, msg);
          case "/info@PlanGameBot":
          case "/info":
            return groupCommands.info(bot, msg, planGame);
          case "/lobby":
            return groupCommands.showLobby(bot, msg, planGame);
          default:
            return;
        }
      }
      // Если сообщение пришло из личного чата
      if (!isGroup) {
        switch (msg.text) {
          case "/start":
            return privateCommands.start(bot, msg);
          case "/my":
            return privateCommands.activeGames(bot, msg, planGame);
          default:
            return;
        }
      }
    } catch (e) {
      return bot.sendMessage(
        msg.chat.id,
        "Произошла ошибка при обработке команды"
      );
    }
  });

  bot.on("callback_query", async (callback) => {
    switch (JSON.parse(callback.data).action) {
      case "look":
        return lookCallback(bot, callback, planGame);
      case "join":
        return joinCallback(bot, callback, planGame);
      case "cancel":
        return cancelCallback(bot, callback, planGame);
      default:
        return bot.sendMessage(
          callback.message.chat.id,
          `Произошла ошибка при обработке колбека`
        );
    }
  });
};

startBot().then();
