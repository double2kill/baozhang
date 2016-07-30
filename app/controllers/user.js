var User = require('../models/user')

// post user signup
exports.POSTsignup = function(req,res) {
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
        req.session.user = user
        res.redirect('/user/myinfo')
      })
    }
  })
}

// post user signin
exports.POSTsignin = function(req, res) {
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

// user admin page
exports.admin = function(req, res){
  User.find(function(err,users){
    if(err){
      console.log(err)
    }

    res.render('user/admin',{
      title: '管理用户页',
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
// myinfo page
exports.myinfo = function(req, res){
  var user = req.session.user
  
  res.render('user/myinfo',{
    title: '我的个人信息',
    user: user
  })
}

exports.POSTadmin = function(req, res) {
  var id = req.body.id
  var role = req.body.role

  User.update({_id: id}, { $set: {role: role}}, function (err) {
    if (err) {
      console.log(err)
    }
    else{
      res.json({success: 1})
    }
  })
}
exports.POSTmyinfo = function(req, res) {
  var id = req.body._id
  var UserObj = {
    name: req.body.name,
    realname: req.body.realname,
    teacher: req.body.teacher,
  }

  User.update({_id: id}, {$set: UserObj}, function (err) {
    if (err) {
      console.log(err)
    }
    else{
      req.session.user.name = req.body.name
      req.session.user.realname = req.body.realname
      req.session.user.teacher = req.body.teacher
      res.redirect('/user/myinfo')
    }
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