const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("WorkPermitDetail", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    work_permit_id: Sequelize.INTEGER(11),
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'work_permit_detail',
});

