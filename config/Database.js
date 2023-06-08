import { Sequelize } from "sequelize";

const db = new Sequelize("express_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;