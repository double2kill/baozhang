var mongoose = require('mongoose')

var IncomeSchema = new mongoose.Schema({
  name: String,
  month: Date,
  totalmoney: Number,
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

IncomeSchema.pre('save', function(next){
  if (this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else{
    this.meta.updateAt = Date.now()
  }

  next()
})

IncomeSchema.statics = {
  fetchReverse: function(cb){
    return this
      .find({})
      .sort('-meta.createAt')
      .limit(10)
      .exec(cb)
  },
  findByCreate: function(cb){
    return this.find({}).sort('meta.createAt').exec(cb);
  },
  findByNeedpaid: function(cb){
    return this.find({"needpaid": true}).sort('meta.createAt').exec(cb);
  },
  findById: function(id,cb){
    return this
      .findOne({_id: id})
      .exec(cb)
  },
  findByName: function(name,cb){
    return this
      .findOne({name: name})
      .exec(cb)
  },
  calsum:function(cb){
    return this.aggregate({$group: {_id: null, sum: {$sum: "$price"}}}).exec(cb);
  }
}

module.exports = IncomeSchema