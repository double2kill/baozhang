var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
// var cookieParser = require('cookie-parser') // express4.0好像不需要用到这个了
var morgan = require('morgan')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000 //如果想要在windows使用PORT，需要在cmd中输入set PORT=8080，然后node app.js
var app = express()

var dbURL = 'mongodb://localhost/liuchen'

mongoose.connect(dbURL)

app.set('views', './app/views/pages/')
app.set('view engine', 'jade')
// app.use(cookieParser()) // express4.0好像不需要用到这个了
app.use(session({
  // 不理解这些是什么意思。
  secret: 'biaodan',
  resave: false,
  saveUninitialized: true,

  //connect-mongo 添加参数
  store: new mongoStore({
    url: dbURL,
    collection: 'sessions'
  })
}))
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json()) 
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)

console.log('web started on port ' + port)

if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(morgan('dev'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}

require('./config/routes')(app)
