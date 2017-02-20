var Income = require('../models/income')
var Record = require('../models/record')
var _ =  require('underscore')

// add page
exports.add = function(req, res){
  var user = req.session.user
  
  res.render('add-update',{
    title: '添加记录页',
    record: {
      name: '',
      price: '',
      date: Date.now(),
      purchaser: user.realname,
      invoice: '',
      remark: ''
    }
  })
}

// list page
exports.list = function(req, res){
  Record.fetchReverse(function(err,records){
    if(err){
      console.log(err)
    }

    Income.findByName('total',function(err,income){
      Record.calsum(function(err, result){
        var tongji = {};
        tongji.totalCost = result[0].sum.toFixed(2);
        tongji.income = income.totalmoney;
        tongji.remain = (tongji.income - tongji.totalCost).toFixed(2);
        res.render('list',{
          title: '查看记录页',
          records: records,
          tongji: tongji
        })
      })
    })
  })
}
// list page
exports.all = function(req, res){
  Record.findByCreate(function(err,records){
    if(err){
      console.log(err)
    }

    res.render('all',{
      title: '查看记录页',
      records: records
    })
  })
}

// admin page
exports.admin = function(req, res){
  Record.findByCreate(function(err,records){
    if(err){
      console.log(err)
    }

    res.render('admin',{
      title: '后台管理',
      records: records
    })
  })
}

// admin update record
exports.update = function(req, res){
  var id = req.params.id

  if (id) {
    Record.findById(id,function(err, record) {
      res.render('add-update', {
        title: '后台修改记录页',
        record: record
      })
    })
  }
}

// admin post record
exports.new = function(req, res){
  var id = req.body._id
  var RecordObj = req.body
  var _record

  if (id !== 'undefined') {
    Record.findById(id, function(err,record){
      if (err) {
        console.log(err)
      }

      _record = _.extend(record, RecordObj)
      _record.save(function(err, record){
        if(err){
          console.log(err)
        }

        res.redirect('/admin/records')
      })
    })
  }
  else{
    _record = new Record({
      name: RecordObj.name,
      price: RecordObj.price,
      purchaser: RecordObj.purchaser,
      date: RecordObj.date,
      remark: RecordObj.remark,
      invoice: RecordObj.invoice,
      needpaid: true,
    })
    _record.save(function(err, record){
      if (err){
        console.log(err)
      }

      res.redirect('/list')
    })
  }
}

// admin delete record
exports.del = function(req,res){
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
}

// admin post record use for change needpaid
exports.POSTneedpaid = function(req,res){
  var id = req.query.id

  if(id) {
    Record.update({_id: id}, { $set: { needpaid: false }}, function(err,record){
      if(err){
        console.log(err)
      }
      else{
        res.json({success: 1})
      }
    })
  }
}

// admin post record use for change needpaid
exports.POSTdone = function(req,res){
  var id = req.query.id

  if(id) {
    Record.update({_id: id}, { $set: { done: true }}, function(err,record){
      if(err){
        console.log(err)
      }
      else{
        res.json({success: 1})
      }
    })
  }
}

// my record page
exports.my = function(req, res){
  var name = req.session.user.realname

  Record.findByPurchaser(name, function(err,records){
    if(err){
      console.log(err)
    }

    res.render('list',{
      title: '查看记录页',
      records: records
    })
  })
}

exports.balance = function (req, res) {
  Income.findByName('total',function(err,income){
    if(err){
      console.log(err)
    }
    Record.calsum(function(err, result){
      var tongji = {};
      tongji.totalCost = result[0].sum.toFixed(2);
      tongji.income = income.totalmoney;
      tongji.remain = (tongji.income - tongji.totalCost).toFixed(2);
      res.render('balance',{ 
        title: '余额',
        tongji: tongji
      })   
    })
  })
}

// jiesuan page
exports.jiesuan = function(req, res){
  Record.findByNeedpaid(function(err,records){
    if(err){
      console.log(err)
    }

    res.render('jiesuan',{
      title: '后台管理',
      records: records
    })
  })
}

