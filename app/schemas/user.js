var mongoose = require('mongoose')
var bcryptjs = require('bcryptjs')

var SALT_FACTOR = 10

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    // 0: normal user
    // 
    // 10: admin
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

UserSchema.pre('save', function(next){
    var user = this
    
    if (this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else{
        this.meta.updateAt = Date.now()
    }

    bcryptjs.genSalt(SALT_FACTOR, function(err,salt){
        if(err) return next(err)

        bcryptjs.hash(user.password, salt, function(err, hash){

            if(err) return next(err)
            user.password = hash
            next()
        })
    })

})

UserSchema.methods = {
    comparePassword: function(_password, cb) {
      bcryptjs.compare(_password, this.password, function(err, isMatch) {
        if (err) {cb(err)}

        cb(null, isMatch)
      })
    }
}

UserSchema.statics = {
    fetchReverse: function(cb){
        return this
          .find({})
          .sort('-meta.createAt')
          .limit(10)
          .exec(cb)
    },
    findById: function(id,cb){
        return this
          .findOne({_id: id})
          .exec(cb)
    }
}

module.exports = UserSchema