import { Bot } from "./interfaces";
import {
  hoursKeyboard,
  IMappedReservationList,
  lobbyKeyboard,
} from "./keyboards";

class botHelper {
  times = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];

  async updateLookMessage(bot: Bot, chatId: string, planGame: any) {
    const lastLookMessage = await planGame.getLastMessageIdByAction(
      String(chatId),
      "look"
    );
    if (lastLookMessage) {
      const lastLookMessageId = lastLookMessage.getDataValue("message_id");
      const mappedReservationList: IMappedReservationList[] = [];
      const reservationList = await planGame.getReserveList(String(chatId));
      for (let i = 0; i < reservationList.length; i++) {
        const time = reservationList[i].getDataValue("start_time");
        const count = await planGame.checkFreePlaces(time, String(chatId));
        mappedReservationList.push({
          start_time: time,
          count: count,
        });
      }
      const keyboardHours = hoursKeyboard(
        String(lastLookMessageId),
        mappedReservationList
      );
      return bot.editMessageText(`Выберите время брони`, {
        chat_id: chatId,
        message_id: Number(lastLookMessageId),
        reply_markup: keyboardHours,
      });
    }
  }

  async updateJoinMessage(bot: Bot, data: any, chatId: string, planGame: any) {
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

    const lastJoinMessage = await planGame.getLastMessageIdByAction(
      String(chatId),
      "join"
    );

    if (lastJoinMessage) {
      const lastJoinMessageId = lastJoinMessage.getDataValue("message_id");
      const keyboard = lobbyKeyboard(data.time, users);

      return bot.editMessageText(`Активные записи на игру в ${data.time}`, {
        chat_id: chatId,
        message_id: Number(lastJoinMessageId),
        reply_markup: keyboard,
      });
    }
  }
}

export default new botHelper();
