var mongoose = require('mongoose')

var RecordSchema = new mongoose.Schema({
	name: String,
	price: String,
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
	findById: function(id,cb){
		return this
		  .findOne({_id: id})
		  .exec(cb)
	},
	findByPurchaser: function(name,cb){
		return this
		  .find({purchaser: name})
		  .exec(cb)
	}
}

module.exports = RecordSchema