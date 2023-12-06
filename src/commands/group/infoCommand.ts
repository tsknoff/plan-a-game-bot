import { Bot, Msg, IPlanGame } from "../../interfaces";
import { hoursKeyboard, IMappedReservationList } from "../../keyboards";

export const infoCommand = async (bot: Bot, msg: Msg, planGame: IPlanGame) => {
  const messageId = msg.message_id;
  const chatId = String(msg.chat.id);

  const botMessages = await planGame.getAllMessages();

  if (botMessages) {
    for (let i = 0; i < botMessages.length; i++) {
      const botMessage = botMessages[i];
      const messageId = botMessage.getDataValue("message_id");
      const chatId = botMessage.getDataValue("chat_id");

      await bot.deleteMessage(chatId, Number(messageId));
      await planGame.deleteMessage(String(messageId));
    }
  }

  const reservationList = await planGame.getReserveList(chatId);
  const mappedReservationList: IMappedReservationList[] = [];

  for (let i = 0; i < reservationList.length; i++) {
    const time = reservationList[i].getDataValue("start_time");
    const count = await planGame.checkFreePlaces(time, chatId);
    mappedReservationList.push({
      start_time: time,
      count: count,
    });
  }

  return bot
    .sendMessage(chatId, `Выберите время брони`, {
      reply_markup: hoursKeyboard(String(messageId), mappedReservationList),
    })
    .then((msg) => {
      planGame.addMessage(String(msg.message_id), String(chatId), "look");
    });
};
