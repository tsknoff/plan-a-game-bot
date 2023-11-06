import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("plan_a_game_bot", "root", "root", {
  host: "master.b6f9ac65-1a91-4d23-9e1c-2054f5a31a5b.c.dbaas.selcloud.ru",
  port: 5432,
  dialect: "postgres",
});
