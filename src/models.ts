import { sequelize } from "./db";
import { DataTypes } from "sequelize";

export type UserAttributes = {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
};
export const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  username: DataTypes.STRING,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
});

export type ReservationAttributes = {
  reservation_id: number;
  chat_id: string;
  user_id: string;
  start_time: string;
};

export const Reservation = sequelize.define("Reservation", {
  reservation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chat_id: DataTypes.STRING,
  user_id: DataTypes.STRING,
  start_time: DataTypes.STRING,
});

export type BotMessagesAttributes = {
  message_id: number;
  chat_id: string;
  action: string;
};
export const BotMessages = sequelize.define("BotMessages", {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  chat_id: DataTypes.STRING,
  action: DataTypes.STRING,
});

User.hasMany(Reservation, { foreignKey: "user_id" });
Reservation.belongsTo(User, { foreignKey: "user_id" });
