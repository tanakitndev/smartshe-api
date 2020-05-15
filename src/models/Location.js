const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("Location", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    lat: Sequelize.STRING(100),
    lng: Sequelize.STRING(100),
    department_id: Sequelize.INTEGER(11),
    user_owner_id: Sequelize.INTEGER(11),
}, {
    timestamps: false,
    tableName: 'locations',
});

