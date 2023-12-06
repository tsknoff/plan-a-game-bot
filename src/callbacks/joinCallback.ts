import { Bot } from "../interfaces";
import { CallbackQuery } from "node-telegram-bot-api";
import botHelper from "../botHelper";

export const joinCallback = async (
  bot: Bot,
  callback: CallbackQuery,
  planGame: any // IPlanGame разобраться с типами
) => {
  const data = JSON.parse(callback.data); // { action: 'join', time: '12:00', messageId: 123 }
  const userId = callback.from.id;
  const chatId = callback.message.chat.id;

  // Проверяем, есть ли пользователь в базе данных
  const userExist = await planGame.isUserExist(String(userId));
  // Если нет, то создаем
  if (!userExist) {
    // Получаем данные пользователя из телеграма
    const user = await bot.getChatMember(chatId, userId);
    const { username, first_name, last_name } = user.user;
    // Создаем пользователя в базе данных
    await planGame.createUser(
      String(userId),
      String(username),
      String(first_name),
      String(last_name)
    );
  }
  // Проверяем, записан ли пользователь на это время
  const userReservation = await planGame.checkUserReservationToday(
    String(userId),
    String(chatId)
  );

  // Если записан, то выдаем сообщение об этом
  if (userReservation) {
    return bot.sendMessage(userId, `Вы уже записаны на игру сегодня`);
  } else {
    // Иначе проверяем, есть ли места
    const reservedPlaces = await planGame.checkFreePlaces(
      data.time,
      String(chatId)
    );

    // Если мест нет, то выдаем сообщение об этом
    if (reservedPlaces >= Number(process.env.MAX_PLAYERS)) {
      return bot.sendMessage(
        userId,
        `К сожалению, на это время нет мест. /info`
      );
    } else {
      // Иначе записываем пользователя
      await planGame.joinLobby(data.time, String(userId), String(chatId));
      return bot
        .sendMessage(userId, `Вы записаны на игру в ${data.time}`)
        .then(async () => {
          await botHelper.updateLookMessage(bot, String(chatId), planGame);
          return botHelper.updateJoinMessage(
            bot,
            data,
            String(chatId),
            planGame
          );
        });
    }
  }
};
