import {
  BotMessages,
  BotMessagesAttributes,
  Reservation,
  ReservationAttributes,
  User,
  UserAttributes,
} from "./models";
import { Model } from "sequelize";

interface PlanGameInterface {
  deleteAllTable(): Promise<number>;
  getUserById(user_id: string): Promise<Model<UserAttributes, UserAttributes>>;
  createUser(
    user_id: string,
    username: string,
    first_name: string,
    last_name: string
  ): Promise<Model<UserAttributes, UserAttributes>>;
  isUserExist(user_id: string): Promise<Model<UserAttributes, UserAttributes>>;
  getReserveListByTime(
    start_time: string,
    chat_id: string
  ): Promise<Model<ReservationAttributes, ReservationAttributes>[]>;
  joinLobby(
    time: string,
    user_id: string,
    chat_id: string
  ): Promise<Model<ReservationAttributes, ReservationAttributes>>;
  checkUserReservation(
    time: string,
    user_id: string,
    chat_id: string
  ): Promise<Model<ReservationAttributes, ReservationAttributes> | null>;
  checkFreePlaces(time: string, chat_id: string): Promise<number>;
  addMessage(
    message_id: string,
    chat_id: string,
    action: string
  ): Promise<Model<BotMessagesAttributes, BotMessagesAttributes>>;
  getAllMessages(): Promise<
    Model<BotMessagesAttributes, BotMessagesAttributes>[]
  >;
  deleteMessage(message_id: string): Promise<number>;
  getLastBotMessageID(
    chat_id: string
  ): Promise<Model<BotMessagesAttributes, BotMessagesAttributes>>;
  getLastMessageIdByAction(
    chat_id: string,
    action: string
  ): Promise<Model<BotMessagesAttributes, BotMessagesAttributes>>;
}

export class PlanGame implements PlanGameInterface {
  deleteAllTable() {
    return Reservation.destroy({
      where: {},
      truncate: true,
    });
  }
  getUserById(user_id: string) {
    return User.findOne({
      where: {
        user_id: user_id,
      },
    });
  }
  createUser(
    user_id: string,
    username: string,
    first_name: string,
    last_name: string
  ) {
    return User.create({
      user_id: user_id,
      username: username,
      first_name: first_name,
      last_name: last_name,
    });
  }

  isUserExist(user_id: string) {
    return User.findOne({
      where: {
        user_id: user_id,
      },
    });
  }

  getReserveListByTime(start_time: string, chat_id: string) {
    return Reservation.findAll({
      where: {
        chat_id: chat_id,
        start_time: start_time,
      },
      include: User, // Это нужно для того чтобы включить в запрос данные из связанной таблицы
    });
  }

  joinLobby(time: string, user_id: string, chat_id: string) {
    return Reservation.create({
      chat_id: chat_id,
      user_id: user_id,
      start_time: time,
    });
  }

  checkUserReservation(time: string, user_id: string, chat_id: string) {
    return Reservation.findOne({
      where: {
        chat_id: chat_id,
        user_id: user_id,
        start_time: time,
      },
    });
  }

  checkFreePlaces(time: string, chat_id: string) {
    return Reservation.count({
      where: {
        chat_id: chat_id,
        start_time: time,
      },
    });
  }

  addMessage(message_id: string, chat_id: string, action: string) {
    return BotMessages.create({
      message_id: message_id,
      chat_id: chat_id,
      action: action,
    });
  }

  getAllMessages() {
    return BotMessages.findAll();
  }

  deleteMessage(message_id: string) {
    return BotMessages.destroy({
      where: {
        message_id: message_id,
      },
    });
  }

  getLastBotMessageID(chat_id: string) {
    return BotMessages.findOne({
      where: {
        chat_id: chat_id,
      },
      order: [["message_id", "DESC"]],
    });
  }

  getLastMessageIdByAction(chat_id: string, action: string) {
    return BotMessages.findOne({
      where: {
        chat_id: chat_id,
        action: action,
      },
      order: [["message_id", "DESC"]],
    });
  }
}
