var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var chalk = require('chalk');


var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    }
    else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}

var mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}



require('dotenv').config();



var app = express();


//MongoDB connect
mongoose.connect(process.env.DB_CONNECTION, mongooseOptions)
  .then(() => {
    console.log(chalk.green("Connected Successfully to port 27017"));
  }).catch((error) => {
    console.log(chalk.red(error));
  });


app.use(cors(corsOptions));





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
