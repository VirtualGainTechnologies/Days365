var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var chalk = require('chalk');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var cron = require('node-cron');
const cronSchedulerService = require('./services/cronSchedulerService');


require('dotenv').config();

var mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}


/**
 * Routers
 */

const testRouter = require('./routes/testRouter');
const countryRouter = require('./routes/countryRouter');
const utilityRouter = require('./routes/utilityRouter');

const tokenRouter = require('./routes/tokenRouter');
const signupRouter = require('./routes/signupRouter');
const signinRouter = require('./routes/signinRouter');
const signoutRouter = require('./routes/signoutRouter');
const forgetPasswordRouter = require('./routes/forgetPasswordRouter');
const vendorDetailsRouter = require('./routes/vendorDetailsRouter');
const categoryRouter = require('./routes/categoryRouter');
const productRouter = require('./routes/productRouter');





var app = express();

//MongoDB connect
mongoose.connect(process.env.DB_CONNECTION, mongooseOptions)
    .then(() => {
        console.log(chalk.green("Connected Successfully to port 27017"));
    }).catch((error) => {
        console.log(chalk.red(error));
    });

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000 }));
app.use(useragent.express());



/**
 * Routes
 */

app.use('/test', testRouter);
app.use('/country', countryRouter);
app.use('/utility', utilityRouter);


app.use('/token', tokenRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/signout', signoutRouter);
app.use('/resetPassword', forgetPasswordRouter);
app.use('/vendorDetails', vendorDetailsRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);





/**
 * Schedulers
 */

//Expired OTP records delete. Run twice in a day.

cron.schedule('0 */12 * * *', async() => {
    console.log("EXPIRED OTP DOCUMENTS DELETION STARTED");
    await cronSchedulerService.deleteExpiredOtpRecords();
});


// Delete Expired PreSignup Documents. Run once in a day

cron.schedule('0 0 * * *', async() => {
    console.log("EXPIRED PRESIGNUP DOCUMENTS DELETION STARTED");
    await cronSchedulerService.deleteExpiredPreSignupRecords();
});




/**
 * Error Handlers
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    console.log("ERROR========================>", chalk.red(err.message));
    // console.log(req);
    res.status(err.status || 500);
    res.setHeader('Content-Type', 'application/json');
    res.json({ message: err.message || "Internal Server Error.", error: true, errors: err.errors || [] });
});

module.exports = app;