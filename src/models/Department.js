const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("Department", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    department: Sequelize.STRING(100),
    building: Sequelize.STRING(100),
    box_fixed: Sequelize.STRING(100),
    value: Sequelize.STRING(100),
    building_code: Sequelize.STRING(10),
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'department',
});

