var mongoose = require('mongoose')

var RecordSchema = new mongoose.Schema({
	name: String,
	price: String,
	purchaser: String,
	date: Date,
	remark: String,
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
	fetch: function(cb){
		return this
		  .find({})
		  .sort('-date')
		  .limit(10)
		  .exec(cb)
	},
	findById: function(id,cb){
		return this
		  .findOne({_id: id})
		  .exec(cb)
	}
}

module.exports = RecordSchema