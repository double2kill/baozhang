var mongoose = require('mongoose')

var InvoiceSchema = new mongoose.Schema({
	name: String,
	price: String,
	useCard: String,
	toWho: String,
	manager: String,
	remark: String,
	date: Date,
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

InvoiceSchema.pre('save', function(next){
	if (this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}

	next()
})

InvoiceSchema.statics = {
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
	findByManager: function(name,cb){
		return this
		  .find({manager: name})
		  .exec(cb)
	}
}

module.exports = InvoiceSchema