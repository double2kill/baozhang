var Invoice = require('../models/invoice')
var _ =  require('underscore')
// about invoice
// add invoice page
exports.add = function(req, res){
  var user = req.session.user
  
  res.render('invoice/addinvoice',{
    title: '添加发票信息页',
    invoice: {
      name: '',
      price: '',
      date: Date.now(),
      useCard: '',
      toWho: user.teacher,
      remark: '',
      manager: user.realname
    }
  })
}

// list invoice page
exports.list = function(req, res){
  Invoice.fetchReverse(function(err,invoices){
    if(err){
      console.log(err)
    }

    res.render('./invoice/list',{
      title: '查看发票信息页',
      invoices: invoices
    })
  })
}
// all invoice page
exports.all = function(req, res){
  Invoice.find(function(err,invoices){
    if(err){
      console.log(err)
    }

    res.render('./invoice/list',{
      title: '查看所有发票信息页',
      invoices: invoices
    })
  })
}

// admin post invoice
exports.new = function(req, res){
  var id = req.body._id
  var InvoiceObj = req.body
  var _invoice

  if (id !== 'undefined') {
    Invoice.findById(id, function(err,invoice){
      if (err) {
        console.log(err)
      }

      _invoice = _.extend(invoice, InvoiceObj)
      _invoice.save(function(err, invoice){
        if(err){
          console.log(err)
        }

        res.redirect('/admin/invoices')
      })
    })
  }
  else{
    _invoice = new Invoice({
      name: InvoiceObj.name,
      price: InvoiceObj.price,
      useCard: InvoiceObj.useCard,
      date: InvoiceObj.date,
      remark: InvoiceObj.remark,
      toWho: InvoiceObj.toWho,
      manager: InvoiceObj.manager,
    })
    _invoice.save(function(err, invoice){
      if (err){
        console.log(err)
      }

      res.redirect('/invoices')
    })
  }
}

// admin invoice page
exports.admin = function(req, res){
  Invoice.find(function(err,invoices){
    if(err){
      console.log(err)
    }

    res.render('./invoice/admin',{
      title: '后台管理发票',
      invoices: invoices
    })
  })
}

// admin delete invoice
exports.del = function(req,res){
  var id = req.query.id

  if(id) {
    Invoice.remove({_id: id}, function(err,invoice){
      if(err){
        console.log(err)
      }
      else{
        res.json({success: 1})
      }
    })
  }
}

// admin update invoice
exports.update = function(req, res){
  var id = req.params.id

  if (id) {
    Invoice.findById(id,function(err, invoice) {
      res.render('./invoice/addinvoice', {
        title: '后台修改发票页',
        invoice: invoice
      })
    })
  }
}

// my invoice page
exports.my = function(req, res){
  var name = req.session.user.realname

  Invoice.findByManager(name, function(err,invoices){
    if(err){
      console.log(err)
    }

    res.render('./invoice/list',{
      title: '查看我的发票',
      invoices: invoices
    })
  })
}