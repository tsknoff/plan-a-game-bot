import { Bot, Msg } from "../../interfaces";

export const startCommand = async (bot: Bot, msg: Msg) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(
    chatId,
    `Для просмотра записей на игровой стол в этом чате нажмите -> /info`
  );
};
