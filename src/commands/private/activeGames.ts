import { Bot } from "../../interfaces";

export const activeGamesCommand = async (bot: Bot, msg: any, planGame: any) => {
  const userId = String(msg.from.id);
  const reserveList = await planGame.getReserveListByUser(userId);
  const list = reserveList.map((item: any) => {
    return {
      start_time: item.getDataValue("start_time"),
      chat_id: item.getDataValue("chat_id"),
    };
  });

  if (list.length === 0) {
    return bot.sendMessage(msg.chat.id, `Нет активных игр`);
  } else {
    console.log("list=>", list);
    list.forEach((item: any) => {
      bot.sendMessage(msg.chat.id, `${item.start_time}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Отменить",
                callback_data: JSON.stringify({
                  action: "cancel",
                  time: item.start_time,
                  chat_id: item.chat_id,
                }),
              },
            ],
          ],
        },
      });
    });
  }

  return;
};
