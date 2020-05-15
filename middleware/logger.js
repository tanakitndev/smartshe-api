const os = require('os');
const externalip = require('externalip');

// connection configurations
const db = require('../utils/database');


const ip_v4_public = (cb) => {
    externalip(function (err, ip) {
        return cb(ip); // => 8.8.8.8
    });
}

const logger = (req, res, next) => {
    ip_v4_public(function (myIP) {
        let dataLogger = {
            computer_name: os.hostname(),
            ip_address: myIP
        }

        db.query("INSERT INTO db_logger SET ? ", { ...dataLogger }, function (error, results, fields) {
            if (error) {
                next(error);
            }
        });

        next();

    });

};

module.exports = logger;