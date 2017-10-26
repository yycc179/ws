var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var url = require('url')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/devices', function (req, res) {
  res.json({
    STBs: [
      { mac: 'ABCDEFGH', ip: '192.168.1.100', geo: '1111111111111111111111' },
      { mac: 'ABCDEFGH'.toLocaleLowerCase(), ip: '192.168.1.110', geo: '2222222222222222222' },
    ]
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

const WebSocket = require('ws');

const wss = new WebSocket.Server({ path: '/debug', port: 8887 });

const list = new Map();

wss.on('connection', function connection(ws, req) {
  var l = url.parse(req.url, true);

  var ds = list.get(l.query.mac) || []
  if (!ds.length) {
    list.set(l.query.mac, ds)
  }
  ds.push(ws);
  ws.on('message', function incoming(message) {
    ws.send(`received: ${message}\n`);
  });

});

function broadcast(data, m, i) {
  var d = list.get(m);
  if (!d) return
  d.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      var n = 0;
      while(n++ < 9) {
      //  data += data;
      }
      client.send(`[${i}]This is ${m}, recv data: ${data}\r\n`);
    }
  });
};

var i = 0
setInterval(function () {
  // broadcast('111111111111111111111111111111111', 'ABCDEFGH', i);
  // broadcast('222222222222222222222222222222222', 'ABCDEFGH'.toLowerCase(), i++);
}, 50)

const utils = require('utility')

var c = utils.sha1('8aZnpw3VZ7W35g29CYe16Q=='+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
console.log(c)

const crypto = require('crypto');
const hash = crypto.createHash('sha1');
hash.update('8aZnpw3VZ7W35g29CYe16Q=='+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
var c= hash.digest('hex')

console.log(c)

module.exports = app;
