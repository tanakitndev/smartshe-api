const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("WorkPermitDetailConfineVerify", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    work_permit_id: Sequelize.INTEGER(11),
    person_id: Sequelize.INTEGER(11),
    press: Sequelize.STRING(20),
    pulse: Sequelize.STRING(20),
    history: Sequelize.TEXT,
    created_at: Sequelize.DATE
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'work_permit_detail_confine_verified',
});

