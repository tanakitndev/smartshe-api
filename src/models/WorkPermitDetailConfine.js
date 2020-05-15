const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("WorkPermitDetailConfine", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    work_permit_detail_id: Sequelize.INTEGER(11),
    name: Sequelize.STRING(200),
    position: Sequelize.STRING(100),
    person_id: Sequelize.INTEGER(11),
    section: Sequelize.STRING(50),
    created_at: Sequelize.DATE
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'work_permit_detail_confine',
});

