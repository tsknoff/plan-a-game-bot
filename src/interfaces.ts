import * as TelegramBot from "node-telegram-bot-api";
import { Message } from "node-telegram-bot-api";
import { Model } from "sequelize";
import {
  BotMessagesAttributes,
  ReservationAttributes,
  UserAttributes,
} from "./models";

export type Bot = TelegramBot;
export type Msg = Message;

export interface IPlanGame {
  deleteAllTable(): Promise<number>;
  getUserById(user_id: string): Promise<Model<UserAttributes, UserAttributes>>;
  createUser(
    user_id: string,
    username: string,
    first_name: string,
    last_name: string
  ): Promise<Model<UserAttributes, UserAttributes>>;
  isUserExist(user_id: string): Promise<Model<UserAttributes, UserAttributes>>;
  getReserveList(
    chat_id: string
  ): Promise<Model<ReservationAttributes, ReservationAttributes>[]>;
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
