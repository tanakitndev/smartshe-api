const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

module.exports = sequelize.define(
  "WorkPermitAdminNotice",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    work_permit_id: Sequelize.INTEGER(11),
    title: Sequelize.STRING(255),
    user_id: Sequelize.INTEGER(11),
    created_at: Sequelize.DATE
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "work_permit_admin_notices"
  }
);
