var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var chalk = require('chalk');
var bodyParser = require('body-parser');


require('dotenv').config();

var mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}



const testRouter = require('./routes/testRouter');
const usersRouter = require('./routes/usersRouter');






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







app.use('/test', testRouter);
app.use('/users', usersRouter);














// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ Status: 'error' });
});

module.exports = app;
