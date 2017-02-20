var Income = require('../models/income')

// add page
exports.addpage = function(req, res){
  res.render('income/add',{
    title: '添加总收入'
  })
}

exports.Postaddincome = function(req, res){
  // 使用updat的后果是数据库中必须有一条数据可以find，否则不会添加也不会报错
  Income.update({name:'total'},{$set:{totalmoney: req.body.income}},function(err){
    if (err){
      console.log(err)
    }

    res.redirect('/balance')
  })
}