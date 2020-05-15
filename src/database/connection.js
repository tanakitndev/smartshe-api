const Sequelize = require('sequelize');

const sequelize = new Sequelize("work_permit_test", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorAliases: false,
});

module.exports = sequelize;
global.sequelize = sequelize;