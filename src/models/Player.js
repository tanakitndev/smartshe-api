const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("Player", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    player_id: Sequelize.STRING(100),
    user_id: Sequelize.INTEGER(11),
    n_approve: Sequelize.STRING(50),
}, {
    // timestamps: false,
    freezeTableName: true,
    tableName: 'players',
});

