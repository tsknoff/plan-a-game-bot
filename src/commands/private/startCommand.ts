import { Bot, Msg } from "../../interfaces";

export const startCommand = async (bot: Bot, msg: Msg) => {
  const chatId = msg.chat.id;

  return bot.sendMessage(
    chatId,
    `В приватном чате с ботом вы можете посмотреть свою активную запись и отменить ее -> /my
  `
  );
};
