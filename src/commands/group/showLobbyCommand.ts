import { Bot, IPlanGame, Msg } from "../../interfaces";
import botHelper from "../../botHelper";

export const showLobbyCommand = async (bot: Bot, msg: Msg, planGame: any) => {
  const times = botHelper.times;
  const users = [];
  const reserveList = await planGame.getReserveList(String(msg.chat.id));
  for (let i = 0; i < reserveList.length; i++) {
    users.push({
      first_name: reserveList[i].getDataValue("User").first_name,
      last_name: reserveList[i].getDataValue("User").last_name,
    });
  }

  const buttons = users.map((user) => {
    return {
      text: `${user.first_name} ${user.last_name}`,
      callback_data: JSON.stringify({
        action: "look",
        time: times[0],
      }),
    };
  });

  const start_time = times[0];

  return bot
    .sendMessage(msg.chat.id, `Активные записи на игру в ${start_time}`, {
      reply_markup: {
        inline_keyboard: [
          buttons,
          [
            {
              text: "Назад",
              callback_data: "back",
            },
            { text: "Вперед", callback_data: "next" },
          ],
        ],
      },
    })
    .then((message) => {
      planGame.addMessage(
        String(message.message_id),
        String(message.chat.id),
        "look"
      );
    });
};
