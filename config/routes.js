var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Record = require('../app/controllers/record')
var Invoice = require('../app/controllers/invoice')

module.exports = function (app) {
  
  // pre handle user
  app.use(function (req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    next()
  })

  // Index
  app.get('/', Index.index)

  // User
  app.get('/user/signup', User.GETsignup)
  app.get('/user/signin', User.GETsignin)
  app.post('/user/signup', User.POSTsignup)
  app.post('/user/signin', User.POSTsignin)

    app.get('/user/logout', User.signinRequired, User.logout)
    app.get('/user/admin', User.signinRequired, User.admin)
    app.get('/user/index', User.signinRequired, User.index)
    app.get('/user/myinfo', User.signinRequired, User.myinfo)
    app.post('/user/myinfo', User.signinRequired, User.POSTmyinfo)
    
    app.post('/user/admin/', User.signinRequired, User.adminRequired, User.POSTadmin)

  // Record
  app.get('/list', Record.list)
  app.get('/all', Record.all)

    app.get('/add', User.signinRequired, Record.add)
    app.get('/record/my', User.signinRequired, Record.my)
    app.post('/admin/record/new', User.signinRequired, Record.new)
    app.get('/admin/records', User.signinRequired, Record.admin)
    app.post('/admin/record/needpaid', User.signinRequired, Record.POSTneedpaid)
    app.post('/admin/record/done', User.signinRequired, Record.POSTdone)
    
    app.get('/admin/record/update/:id', User.signinRequired, User.adminRequired, Record.update)
    app.delete('/admin/record/', User.signinRequired, User.adminRequired, Record.del)

  // Invoice
  app.get('/invoice/all', Invoice.all)
  app.get('/invoices', Invoice.list)

    app.post('/admin/invoice/new', User.signinRequired, Invoice.new)
    app.get('/invoice/my', User.signinRequired, Invoice.my)
    app.get('/invoice/add', User.signinRequired, Invoice.add)
    app.get('/admin/invoices', User.signinRequired, Invoice.admin)

    app.get('/admin/invoice/update/:id', User.signinRequired, User.adminRequired, Invoice.update)
    app.delete('/admin/invoice/', User.signinRequired, User.adminRequired,Invoice.del)

}