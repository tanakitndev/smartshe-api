const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    password: Sequelize.STRING(300),
    displayname: Sequelize.STRING(300),
    right1: Sequelize.STRING(3),
    right2: Sequelize.STRING(100),
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'user',
});

