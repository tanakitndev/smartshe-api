const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

module.exports = sequelize.define(
  "Notification",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: Sequelize.STRING(255),
    subtitle: Sequelize.STRING(255),
    player_id: Sequelize.INTEGER(11),
    is_clicked: {
      type: Sequelize.ENUM,
      values: ["0", "1"],
      defaultValue: "0"
    },
    work_permit_id: Sequelize.INTEGER(11)
  },
  {
    // timestamps: false,
    freezeTableName: true,
    tableName: "notifications",
  }
);
