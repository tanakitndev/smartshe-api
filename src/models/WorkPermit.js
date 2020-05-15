const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

module.exports = sequelize.define("WorkPermit", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    area_floor: Sequelize.STRING(100),
    box_sensor: Sequelize.STRING(100),
    department_id: Sequelize.INTEGER(11),
    building: Sequelize.STRING(100),
    location_id: Sequelize.INTEGER(11),
    permit_enable: Sequelize.STRING(300),
    permit_detail: Sequelize.STRING(1000),
    holdpicture: Sequelize.STRING(1000),
    department: Sequelize.STRING(100),
    description: Sequelize.STRING(200),
    expires: Sequelize.STRING(100),
    expires_detail: Sequelize.STRING(600),
    job_member: Sequelize.STRING(5),
    note: Sequelize.STRING(200),
    phone_no: Sequelize.STRING(15),
    site: Sequelize.STRING(100),
    team: Sequelize.STRING(100),
    user_id: Sequelize.INTEGER(11),
    approve_detail: Sequelize.STRING(1000),
    statuspermit: Sequelize.ENUM('pending', 'inprocess1', 'inprocess2', 'inprocess3', 'active'),
    nurse_checked: Sequelize.ENUM('0', '1'),
    remark: Sequelize.TEXT,
    status_close: Sequelize.STRING(100),
    status_close_job: Sequelize.STRING(1000),
    timestamp: Sequelize.DATE
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'work_permit',
});

