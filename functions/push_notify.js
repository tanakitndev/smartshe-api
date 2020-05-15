var OneSignal = require("onesignal-node");

const myClient = new OneSignal.Client(
  process.env.ONESIGNAL_APP_ID, // appId
  process.env.ONESIGNAL_REST_KEY // apiKey or restKey
);

module.exports = (notification, cb) => {
  // or you can use promise style:
  // myClient
  //   .createNotification(notification)
  //   .then((response) => {
  //     console.log(JSON.stringify(response));
  //     cb();
  //   })
  //   .catch((e) => {
  //     console.log(JSON.stringify(e));
  //   });
};
