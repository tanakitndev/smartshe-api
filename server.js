const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors')
const request = require('request');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Local env vars
dotenv.config({ path: './config/config.env' });

// connection configurations
const db = require('./utils/database');
const mydb = require('./src/database/database');
// connect to database
db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Load Routes
const appVersionsRouter = require('./routes/app_versions.routes');
const indexRouter = require('./routes/index.routes')(io);
const testRouter = require('./routes/test.routes');
const authRouter = require('./routes/auth.routes');
const dashboardRouter = require('./routes/dashboard.routes')(io);
const dbLoggerRouter = require('./routes/db-logger.routes');
const cameraIpRouter = require('./routes/camera-ips.routes');
const smartsensorDatanowRouter = require('./routes/smartsensor_datanow.routes')(io);
const smartsensorDatalogRouter = require('./routes/smartsensor_datalog.routes');
const datanowRouter = require('./routes/datanow.routes');
const datalogRouter = require('./routes/datalog.routes');
const envStandardRouter = require('./routes/env_standard.routes');
const workPermitRouter = require('./routes/work_permit.routes');
const masterRouter = require('./routes/master.routes');
const workPermitQuestionsRouter = require('./routes/work_permit_questions.routes');
const tasksRouter = require('./routes/tasks.routes');
const workPermitEnablesRouter = require('./routes/work_permit_enables.routes');

const lineMessageRouter = require('./routes/line-message.routes')(io);
const uploadImageRouter = require('./routes/upload-image.routes');
const workPermitImagesRouter = require('./routes/work_permit_images.routes');
const workPermitDetailRouter = require('./routes/work_permit_detail.routes');
const personsRouter = require('./routes/persons.routes');
const departmentsRouter = require('./routes/departments.routes');
const locationsRouter = require('./routes/locations.routes');

const imagesRouter = require('./routes/work_permit_images.routes');

const adminRouter = require('./routes/admin.routes');
const ownerRouter = require('./routes/owner.routes');
const jobListRouter = require('./routes/job_list.routes')(io);
const emergencyContactsRoute = require('./routes/emergency_contacts.routes');
const positionsRoute = require('./routes/positions.routes');

const workPermitDetailConfineVerifiedRoute = require('./routes/work_permit_detail_confine_verified.routes');

const workPermitAdminVerifyRoute = require('./routes/work_permit_admin_verifies.routes');
const workPermitAdminNoticesRoute = require('./routes/work_permit_admin_notices.routes');
const workPermitAdminProtectionsRoute = require('./routes/work_permit_admin_protections.routes');

const DashboardMobileRoute = require('./routes/dashboard_mobile.routes');

const PlayersRoute = require('./routes/players.routes');
const NotificationsRoute = require('./routes/notifications.routes');

const ReportWorkPermitRoute = require('./routes/report_work_permit.routes');

// Load middleware
app.use(cors());

// bootstrap model
require('./src/database/connection');
require('./src/bootstrap')();

// default route
app.use('/api/v1/', indexRouter);
app.use('/api/v1/app_versions', appVersionsRouter);
app.use('/api/v1/test', testRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/db-logger', dbLoggerRouter);
app.use('/api/v1/camera_ips', cameraIpRouter);
app.use('/api/v1/smartsensor_datanow', smartsensorDatanowRouter);
app.use('/api/v1/smartsensor_datalog', smartsensorDatalogRouter);
app.use('/api/v1/datanow', datanowRouter);
app.use('/api/v1/datalog', datalogRouter);
app.use('/api/v1/env_standard', envStandardRouter);
app.use('/api/v1/work_permit', workPermitRouter);
app.use('/api/v1/work_permit_questions', workPermitQuestionsRouter);
app.use('/api/v1/tasks', tasksRouter);
app.use('/api/v1/work_permit_enables', workPermitEnablesRouter);
app.use('/api/v1/master', masterRouter);
app.use('/api/v1/line-message', lineMessageRouter);
app.use('/api/v1/images', workPermitImagesRouter);
app.use('/api/v1/work_permit_detail', workPermitDetailRouter);
app.use('/api/v1/persons', personsRouter);
app.use('/upload-image', uploadImageRouter);
app.use('/images', imagesRouter);

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/owner', ownerRouter);
app.use('/api/v1/joblist', jobListRouter);

app.use('/api/v1/emergency_contacts', emergencyContactsRoute);
app.use('/api/v1/positions', positionsRoute);
app.use('/api/v1/departments', departmentsRouter);
app.use('/api/v1/locations', locationsRouter);

app.use('/api/v1/work_permit_detail_confine_verified', workPermitDetailConfineVerifiedRoute);

app.use('/api/v1/work_permit_admin_verifies', workPermitAdminVerifyRoute);
app.use('/api/v1/work_permit_admin_notices', workPermitAdminNoticesRoute);
app.use('/api/v1/work_permit_admin_protections', workPermitAdminProtectionsRoute);

app.use('/api/v1/dashboard_mobile', DashboardMobileRoute);

app.use('/api/v1/players', PlayersRoute);
app.use('/api/v1/notifications', NotificationsRoute);

app.use('/api/v1/report_work_permit', ReportWorkPermitRoute);

// set port
server.listen(process.env.PORT, function () {
    console.log(`Node app is running on port ${process.env.PORT}`);
});


app.get('/watch-sensors/:data', (req, res) => {
    io.emit('receiveAlarm', req.params.data);
    res.send({
        success: true
    })
});

app.post('/watch-sensors', (req, res) => {
    io.emit('receiveAlarm', req.body);
    res.send({
        success: true
    })
});

setInterval(async () => {
    let resultsSmartSensorDataNow;
    let resultsEnv;

    const [smt_datanow, fields_smt_datanow] = await mydb.query('SELECT * FROM smartsensor_datanow', null);
    resultsSmartSensorDataNow = smt_datanow;
    const [env_standard, fields_env_standard] = await mydb.query('SELECT * FROM env_standard', null);
    resultsEnv = env_standard;



    resultsSmartSensorDataNow.forEach(datanow => {
        let existEnv;
        existEnv = resultsEnv.find(env => {
            return env.env_type === datanow.type
        });

        if (existEnv) {
            // console.log(parseFloat(datanow.value));
            // console.log(parseFloat(existEnv.danger));

            if (parseFloat(datanow.value) >= parseFloat(existEnv.danger)) {
                io.sockets.emit('detected_env', `${datanow.location}, ${datanow.value}, '>=', ${existEnv.danger}`);

                const options = {
                    url: 'https://notify-api.line.me/api/notify',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${process.env.LINE_TOKEN}`
                    },
                    form: {
                        message: `\n${datanow.location} ${datanow.type} ${datanow.value} >= ${existEnv.danger}`
                    }
                }

                request.post(options,
                    function (err, httpResponse, body) {
                        if (err) {
                            // return next(err);
                            console.log(err);

                        }

                        let myMessage = options.form.message.replace(/\//g, '_');
                        // console.log(myMessage);
                        myMessage = myMessage.replace(/[?]/g, '!');
                        request.get(`${process.env.WEBSITE_ROOT}/watch-sensors/${myMessage}`);
                    });
            }
        }
    }

    );
}, 6000);

app.use(express.static(path.join(__dirname, 'public', 'images')));
// Handler errors
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        errorCode: error.code,
        message: error.message || 'An unknow error occorred!'
    })
});


