var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Record = require('./models/record')
var port = process.env.PORT || 3000 //如果想要在windows使用PORT，需要在cmd中输入set PORT=8080，然后node app.js
var app = express()

mongoose.connect('mongodb://localhost/liuchen')

app.set('views', './views/pages/')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json()) 
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)

console.log('web started on port ' + port)

// index page
app.get('/', function(req, res){
  res.render('index',{ 
  	title: 'double2kill的首页'
  })
})

// add page
app.get('/add', function(req, res){
  res.render('add',{
  	title: '添加记录页',
  	record: {
  		name: '',
  		price: '',
  		date: '',
  		purchaser: '',
  		remark: ''
  	}
  })
})

// list page
app.get('/list', function(req, res){
  Record.fetch(function(err,records){
    if(err){
      console.log(err)
    }

    res.render('list',{
      title: '查看记录页',
      records: records
    })
  })
})

// admin page
app.get('/admin', function(req, res){
  Record.find(function(err,records){
    if(err){
      console.log(err)
    }

    res.render('admin',{
      title: '后台管理',
      records: records
    })
  })


})

// admin post record
app.post('/admin/record/new', function(req, res){
  var RecordObj = req.body
  var _record

    _record = new Record({
      name: RecordObj.name,
      price: RecordObj.price,
      purchaser: RecordObj.purchaser,
      date: RecordObj.date,
      remark: RecordObj.remark
    })
    _record.save(function(err, record){
      if (err){
        console.log(err)
      }
      res.redirect('/list')
    })
}) 

// admin delete record
app.delete('/admin/record/',function(req,res){
  var id = req.query.id

  if(id) {
    Record.remove({_id: id}, function(err,record){
      if(err){
        console.log(err)
      }
      else{
        res.json({success: 1})
      }
    })
  }
})