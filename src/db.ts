import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "default_db",
  "gen_user",
  "$.*/3&#dR\\qIYS",
  {
    host: "77.232.129.191",
    port: 5432,
    dialect: "postgres",
  }
);
