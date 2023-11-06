import * as dotenv from "dotenv";
dotenv.config();
import TelegramApi = require("node-telegram-bot-api");
import { sequelize } from "./db";
import { hoursKeyboard, lobbyKeyboard } from "./keyboards";
import { PlanGame } from "./PlanGame";
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramApi(token, {
  polling: true,
});

const startBot = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (e) {
    console.log("Подключение к бд сломалось", e);
  }

  const planGame = new PlanGame();

  await bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Посмотреть записи на игру" },
  ]);

  bot.on("message", async (msg) => {
    const messageId = msg.message_id;
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        return bot.sendMessage(
          chatId,
          `Данный бот предназначен для записи на игру в пинг понг.`
        );
      }
      if (text === "/info") {
        const botMessages = await planGame.getAllMessages();
        if (botMessages) {
          for (let i = 0; i < botMessages.length; i++) {
            const botMessage = botMessages[i];
            const messageId = botMessage.getDataValue("message_id");
            const chatId = botMessage.getDataValue("chat_id");

            await bot.deleteMessage(chatId, Number(messageId));
            await planGame.deleteMessage(messageId);
          }
        }

        return bot
          .sendMessage(
            chatId,
            `Какое время вас интересует?`,
            hoursKeyboard(messageId)
          )
          .then((msg) => {
            planGame.addMessage(String(msg.message_id), String(chatId), "look");
          });
      }
      // if (text === "/test") {
      //   console.log("chatId=>", String(chatId));
      //   return bot.sendMessage(chatId, `test`).then((msg) => {
      //     console.log("msg.message_id=>", msg.message_id);
      //     planGame.addMessage(String(msg.message_id), String(chatId), "test");
      //   });
      // }
      // if (text === "/edit") {
      //   console.log("chatId=>", String(chatId));
      //   const lastBotMessage = await planGame.getLastMessageIdByAction(
      //     String(chatId),
      //     "test"
      //   );
      //   const lastBotMessageId = lastBotMessage.getDataValue("message_id");
      //
      //   if (lastBotMessageId) {
      //     return bot.editMessageText(`Измененный текст`, {
      //       chat_id: chatId,
      //       message_id: Number(lastBotMessageId),
      //     });
      //   }
      // }
    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая то ошибка");
    }
  });

  bot.on("callback_query", async (msg) => {
    console.log("callback_query msg=>", msg);
    const data = JSON.parse(msg.data);
    const userId = msg.from.id;
    const chatId = msg.message.chat.id;

    switch (data.action) {
      case "look":
        console.log("chatId=>", String(chatId));
        const reserveList = await planGame.getReserveListByTime(
          data.time,
          String(chatId)
        );
        const users = [];
        for (let i = 0; i < reserveList.length; i++) {
          users.push({
            first_name: reserveList[i].getDataValue("User").first_name,
            last_name: reserveList[i].getDataValue("User").last_name,
          });
        }

        const lastBotMessage = await planGame.getLastMessageIdByAction(
          String(chatId),
          "join"
        );

        if (lastBotMessage) {
          const lastBotMessageId = lastBotMessage.getDataValue("message_id");

          const keyboard = lobbyKeyboard(data.time, users);

          return bot
            .editMessageReplyMarkup(keyboard, {
              chat_id: chatId,
              message_id: Number(lastBotMessageId),
            })
            .then(() => {
              bot.editMessageText(`Активные записи на игру в ${data.time}`, {
                chat_id: chatId,
                message_id: Number(lastBotMessageId),
              });
            });
        }

        return bot
          .sendMessage(chatId, `Активные записи на игру в ${data.time}`, {
            reply_markup: lobbyKeyboard(data.time, users),
          })
          .then((msg) => {
            console.log("msg22222=>", msg);
            planGame.addMessage(String(msg.message_id), String(chatId), "join");
          });
      case "join":
        const userExist = await planGame.isUserExist(String(userId));
        if (!userExist) {
          const user = await bot.getChatMember(chatId, userId);
          const { username, first_name, last_name } = user.user;
          await planGame.createUser(
            String(userId),
            String(username),
            String(first_name),
            String(last_name)
          );
        }
        const userReservation = await planGame.checkUserReservation(
          data.time,
          String(userId),
          String(chatId)
        );

        if (userReservation) {
          return bot.sendMessage(chatId, `Вы уже записаны на это время`);
        }

        const freePlaces = await planGame.checkFreePlaces(
          data.time,
          String(chatId)
        );

        if (freePlaces >= 4) {
          return bot.sendMessage(chatId, `Мест нет`);
        } else {
          await planGame.joinLobby(data.time, String(userId), String(chatId));
          return bot.sendMessage(chatId, `Вы записаны на игру`);
        }
      default:
        return bot.sendMessage(chatId, `Неизвестная команда`);
    }
  });
};

startBot().then();
