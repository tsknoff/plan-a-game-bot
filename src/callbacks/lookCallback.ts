import { CallbackQuery } from "node-telegram-bot-api";
import { lobbyKeyboard } from "../keyboards";
import { Bot } from "../interfaces";

export const lookCallback = async (
  bot: Bot,
  callback: CallbackQuery,
  planGame: any // IPlanGame разобраться с типами
) => {
  const data = JSON.parse(callback.data);
  const chatId = callback.message.chat.id;

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

    return bot.editMessageText(`Активные записи на игру в ${data.time}`, {
      chat_id: chatId,
      message_id: Number(lastBotMessageId),
      reply_markup: keyboard,
    });
  }

  return bot
    .sendMessage(chatId, `Активные записи на игру в ${data.time}`, {
      reply_markup: lobbyKeyboard(data.time, users),
    })
    .then((msg) => {
      planGame.addMessage(String(msg.message_id), String(chatId), "join");
    });
};
