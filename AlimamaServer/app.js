var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//path to router files
var productRouter = require('./routes/product');
var factureRouter = require('./routes/facture');
var usersRouter = require('./routes/users');
var entrepriseRouter = require('./routes/entreprise');
var categoryRouter = require('./routes/category');

const db = require('./config/database');

// Test DB
db.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error: ' + err))
var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/product',  productRouter);
app.use('/facture',  factureRouter);
app.use('/user',  usersRouter);
app.use('/entreprise',  entrepriseRouter);
app.use('/category',  categoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
