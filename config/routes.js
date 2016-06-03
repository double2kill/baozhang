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
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)

    app.get('/user/logout', User.signinRequired, User.logout)
    app.get('/user/list', User.signinRequired, User.list)
    app.get('/user/index', User.signinRequired, User.index)

  // Record
  app.get('/add', Record.add)
  app.get('/list', Record.list)
  app.get('/all', Record.all)
  app.post('/admin/record/new', Record.new)

    app.get('/admin/records', User.signinRequired, Record.admin)
    app.post('/admin/record/needpaid', User.signinRequired, Record.POSTneedpaid)
    
    app.get('/admin/record/update/:id', User.signinRequired, User.adminRequired, Record.update)
    app.delete('/admin/record/', User.signinRequired, User.adminRequired, Record.del)

  // Invoice
  app.get('/invoice/add', Invoice.add)
  app.post('/admin/invoice/new', Invoice.new)
  app.get('/invoices', Invoice.list)

    app.get('/admin/invoices', User.signinRequired, Invoice.admin)

    app.get('/admin/invoice/update/:id', User.signinRequired, User.adminRequired, Invoice.update)
    app.delete('/admin/invoice/', User.signinRequired, User.adminRequired,Invoice.del)

}