import { Bot } from "../interfaces";
import { CallbackQuery } from "node-telegram-bot-api";
import botHelper from "../botHelper";

export const cancelCallback = async (
  bot: Bot,
  callback: CallbackQuery,
  planGame: any // IPlanGame разобраться с типами
) => {
  const callbackExample = {
    id: "654193735339273560",
    from: {
      id: 152316348,
      is_bot: false,
      first_name: "Egor",
      last_name: "Tsukanov",
      username: "tsukanov",
      language_code: "ru",
    },
    message: {
      message_id: 1171,
      from: {
        id: 6748663808,
        is_bot: true,
        first_name: "Plan a game",
        username: "PlanGameBot",
      },
      chat: {
        id: 152316348,
        first_name: "Egor",
        last_name: "Tsukanov",
        username: "tsukanov",
        type: "private",
      },
      date: 1699373819,
      text: "12:00-12:30",
      reply_markup: { inline_keyboard: [Array] },
    },
    chat_instance: "7071517508487142601",
    data: '{"action":"cancel","time":"12:00-12:30","chat_id":"-4018172968"}',
  };

  console.log("callback=>", callback);
  const data = JSON.parse(callback.data); // { action: 'cancel', time: '12:00-12:30', chat_id: -123 }
  const userId = callback.message.chat.id;
  const chatId = data.chat_id;
  const time = data.time.split("-")[0];
  console.log("time=>", time);

  // Проверяем, записан ли пользователь на это время
  const userReservation = await planGame.checkUserReservation(
    String(userId),
    String(chatId),
    String(time)
  );

  // Если записан, то отменяем запись
  console.log("userReservation=>", userReservation);
  if (!userReservation) {
    await planGame.cancelReservation(String(userId), String(chatId));
    await botHelper.updateLookMessage(bot, String(chatId), planGame);
    return bot.sendMessage(userId, `Вы отменили запись на игру в ${data.time}`);
  } else {
    // Иначе выдаем сообщение об этом
    return bot.sendMessage(userId, `Вы не записаны на игру в ${data.time}`);
  }
};
