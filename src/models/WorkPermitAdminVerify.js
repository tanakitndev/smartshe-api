const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("WorkPermitAdminVerify", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    work_permit_id: Sequelize.INTEGER(11),
    // gas: Sequelize.STRING(20),
    // steam: Sequelize.STRING(20),
    // spray: Sequelize.STRING(20),
    // dust: Sequelize.STRING(20),
    oxygen: Sequelize.STRING(20),
    gas: Sequelize.STRING(20),
    h2s: Sequelize.STRING(20),
    co: Sequelize.STRING(20),
    created_at: Sequelize.DATE
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'work_permit_admin_verifies',
});


