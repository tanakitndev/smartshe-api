const express = require('express');
const router = express.Router();
const request = require('request');

// connection configurations
const db = require('../utils/database');

module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log(`Line Notify Conected. ${new Date()}`);

        socket.on('disconnect', function () {
            console.log('unsub Line Notify');
        });
    });




    router.get('/send/:message', (req, res, next) => {
        io.emit('lne-notify', req.params.message);

        const options = {
            url: 'https://notify-api.line.me/api/notify',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer eh5BWo3ORqqpZmGR2icFcdCH1PbAen0Zh74tvyVdvAR'
            },
            form: { message: req.params.message }
        }

        request.post(options,
            function (err, httpResponse, body) {
                if (err) {
                    return next(err)
                }
                res.send(JSON.parse(body));
            });
    });

    router.post('/send', (req, res, next) => {

        let datetime = new Date();
        let date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
        let month = (datetime.getMonth() + 1) < 10 ? '0' + datetime.getMonth() + 1 : datetime.getMonth() + 1;
        let subYear = (datetime.getFullYear() + 543).toString();
        let hours = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
        let minutes = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
        let seccond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();

        let messageResult = {
            root_site: `${process.env.CLIENT_ROOT}`,
            uuid: `${date}${month}${subYear.substr(2, 3)}${hours}${minutes}${seccond}`,
            status: req.body.status,
            message: req.body.message
        }

        const options = {
            url: 'https://notify-api.line.me/api/notify',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${process.env.LINE_TOKEN}`
            },
            form: {
                // message: `\nuuid: ${messageResult.uuid}\nstatus: ${messageResult.status}\nmessage: ${messageResult.message}`
                message: `\nuuid: ${messageResult.uuid}\n status: ${messageResult.status} \n message: ${messageResult.message}`
            }
        }

        request.post(options,
            function (err, httpResponse, body) {
                if (err) {
                    return next(err)
                }

                let myMessage = options.form.message.replace(/\//g, '_');
                myMessage = myMessage.replace(/[?]/g, '!');

                request.get(`${process.env.WEBSITE_ROOT}/watch-sensors/${myMessage}`);
                res.send(JSON.parse(body));
            });
    });

    router.post('/send-camera', (req, res, next) => {

        let datetime = new Date();
        let date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
        let month = (datetime.getMonth() + 1) < 10 ? '0' + datetime.getMonth() + 1 : datetime.getMonth() + 1;
        let subYear = (datetime.getFullYear() + 543).toString();
        let hours = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
        let minutes = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
        let seccond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();

        db.query('SELECT * FROM camera_ips WHERE ?', { location_id: req.body.location_id }, function (error, results, fields) {
            if (error) {
                console.log(error);
            }

            let location = results[0];

            let messageResult = {
                // root_site: 'http://ptfwebsite.ddns.net/wpm-client',
                location_id: location.location_id,
                root_site: `${process.env.CLIENT_ROOT}`,
                uuid: `${date}${month}${subYear.substr(2, 3)}${hours}${minutes}${seccond}`,
                status: req.body.status,
                camera_url: location.url.split('?')[0],
                message: req.body.message
            }

            const options = {
                url: 'https://notify-api.line.me/api/notify',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${process.env.LINE_TOKEN}`
                },
                form: {
                    message: `\nuuid: ${messageResult.uuid} \nstatus: ${messageResult.status} \nmessage: ${messageResult.message} look at, \n${messageResult.root_site}/ip-camera?url=${messageResult.camera_url}&location=${messageResult.location_id}`
                }
            }

            request.post(options,
                function (err, httpResponse, body) {
                    if (err) {
                        return next(err)
                    }

                    let myMessage = options.form.message.replace(/\//g, '_');
                    myMessage = myMessage.replace(/[?]/g, '!');

                    request.get(`${process.env.WEBSITE_ROOT}/watch-sensors/${myMessage}`);
                    res.send(JSON.parse(body));
                });


        });
    });

    return router;
};

