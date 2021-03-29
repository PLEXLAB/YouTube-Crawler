var createError 	= require('http-errors');
var express 		= require('express');
var path 			= require('path');
var cookieParser 	= require('cookie-parser');
var logger 			= require('morgan');
const bodyParser 	= require('body-parser');
var session 		= require("express-session");
var monk 			= require('monk');
var db 				= monk('localhost:27017/channelsMetaData');
var indexRouter 	= require('./routes/index');
var usersRouter 	= require('./routes/users');
var app = express();
//=================================================
var http = require('http').Server(app);
var io = require('socket.io')(http);
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});
http.listen(3000, function() {
   console.log('listening on *:3000');
});
// End of socet io
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"secSaleem", resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));
// to solve an issue with CROS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
// Make our db accessible to our router
app.use(function(req,res,next){
	req.db = db;
	next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
