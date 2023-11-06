import { sequelize } from "./db";
import { DataTypes } from "sequelize";

// Сделать модель для записи на игру в пинг понг
// Модель для пользователей
export const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  username: DataTypes.STRING,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
});

// Модель для резерваций
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

export const BotMessages = sequelize.define("BotMessages", {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  chat_id: DataTypes.STRING,
  action: DataTypes.STRING,
});

// Определяем связи между моделями
User.hasMany(Reservation, { foreignKey: "user_id" });
Reservation.belongsTo(User, { foreignKey: "user_id" });
