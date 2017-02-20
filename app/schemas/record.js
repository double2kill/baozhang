var mongoose = require('mongoose')

var RecordSchema = new mongoose.Schema({
	name: String,
	price: Number,
	purchaser: String,
	date: Date,
	remark: String,
	needpaid: Boolean,
	done: Boolean,
	invoice: String,
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

RecordSchema.pre('save', function(next){
	if (this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}

	next()
})

RecordSchema.statics = {
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
	findByPurchaser: function(name,cb){
		return this
		  .find({purchaser: name})
		  .exec(cb)
	},
	calsum:function(cb){
		return this.aggregate({$group: {_id: null, sum: {$sum: "$price"}}}).exec(cb);
	}
}

module.exports = RecordSchema