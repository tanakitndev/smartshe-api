const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../utils/database');
const Department = require('../src/models/Department');
const Location = require('../src/models/Location');

const { Op } = require("sequelize");

router.get('/sites', (req, res, next) => {
    db.query('SELECT * FROM site', function (error, results, fields) {
        return res.send({
            error: false,
            data: results,
        });
    });
});

router.get('/departments', async (req, res, next) => {
    const departments = await Department.findAll({
        where: {
            department: {
                [Op.not]: null
            }
        }
    }).catch(err => {
        return next(err);
    });
    return res.send({
        error: false,
        data: departments,
    });
});

router.post('/departments', (req, res, next) => {
    db.query('SELECT deparment FROM department WHERE ?', { id: req.body.department_id }, function (error, results, fields) {
        let department = results[0].department;
        
        db.query('SELECT * FROM department WHERE ?', { department: department }, function (error, results, fields) {
            return res.send({
                error: false,
                data: results,
            });
        });
        // return res.send({
        //     error: false,
        //     data: results[0].deparment,
        // });
    });
    // db.query('SELECT * FROM department WHERE ?', { deparment: req.body.department_name }, function (error, results, fields) {
    //     return res.send({
    //         error: false,
    //         data: results,
    //     });
    // });
});

router.get('/box-sensors', (req, res, next) => {
    db.query('SELECT NodeID FROM DataNow GROUP BY NodeID', function (error, results, fields) {
        return res.send({
            error: false,
            data: results,
        });
    });
});

router.get('/locations', async (req, res, next) => {
    const locations = await Location.findAll({
        include: [{ model: Department, as: 'departments' }]
    }).catch(err => {
        return next(err);
    });
    return res.send({
        error: false,
        data: locations,
    });
});

router.post('/locations', (req, res, next) => {
    db.query('SELECT * FROM locations WHERE ? GROUP BY name', { department_id: req.body.department_id }, function (error, results, fields) {
        return res.send({
            error: false,
            data: results,
        });

    });
});

module.exports = router;
