const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("RightUser", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    w_right: Sequelize.STRING(100),
    sign_right: Sequelize.STRING(100),
    n_approve: Sequelize.STRING(100),
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'right_user',
});

