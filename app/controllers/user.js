var User = require('../models/user')
// post user signup
exports.signup = function(req,res) {
  var _user = req.body

  User.findOne({'name': _user.name}, function(err, user) {
    if(err){
      console.log(err)
    }

    if(user){
      // 注册的用户名已存在
      return res.redirect('/user/signin')
    }
    else{
      var user =  new User(_user)
      user.save(function(err, user) {
        if (err) {
            console.log(err)
        }

        //注册成功
        res.redirect('/user/signin')
      })
    }
  })
}

// post user signin
exports.signin = function(req, res) {
  var _user = req.body
  var name = _user.name
  var password = _user.password

  User.findOne({'name': name}, function(err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {//用户名不存在
      return res.redirect('/user/signin')
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err)
      }

      if (isMatch) {//用户登录成功
        req.session.user = user
        return res.redirect('/user/index')
      }
      else{//用户登录失败
        return res.redirect('/user/signin')
      }
    })
  })
}

// user logout
exports.logout = function (req, res) {
  delete req.session.user
  // delete app.locals.user

  res.redirect('/')
}

// user list page
exports.list = function(req, res){
  User.find(function(err,users){
    if(err){
      console.log(err)
    }

    res.render('user/list',{
      title: '查看用户页',
      users: users
    })
  })
}

// get sign up page
exports.GETsignup = function(req, res){
    res.render('user/signup',{
      title: '注册页面',
    })
}
// get sign in page
exports.GETsignin = function(req, res){
    res.render('user/signin',{
      title: '登录页面',
    })
}

// user index, after signin
exports.index = function(req, res){
    res.render('user/index',{
      title: '用户导航页',
    })
}


//midware for user signin and admin
exports.signinRequired = function (req, res, next) {
  var user = req.session.user

  if (!user) {
    return res.redirect('/user/signin')
  }

  next()
}
exports.adminRequired = function (req, res, next) {
  var user = req.session.user

  if (user.role < 10) {
    return res.redirect('/user/signin')
  }

  next()
}