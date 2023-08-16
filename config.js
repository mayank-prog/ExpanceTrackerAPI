const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

//port--
exports.PORT=process.env.PORT;

//database----
exports.USER_NAME=process.env.USER_NAME;
exports.DATABASE_NAME=process.env.DATABASE_NAME;
exports.USER_PASSWORD=process.env.USER_PASSWORD;
exports.HOST_NAME=process.env.HOST_NAME;

//Payment---
exports.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
exports.RAZORPAY_KEY_SECRET=process.env.RAZORPAY_KEY_SECRET;

//AWS---
exports.BUCKET_NAME = process.env.BUCKET_NAME;
exports.IAM_USER_KEY = process.env.IAM_USER_KEY;
exports.IAM_USER_SECRET = process.env.IAM_USER_SECRET;

//sendInBlue---
exports.SENDER_EMAIL = process.env.SENDER_EMAIL;
exports.SENDINBLUE_KEY_SECRT=process.env.SENDINBLUE_KEY_SECRT;
