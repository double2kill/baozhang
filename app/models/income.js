var mongoose = require('mongoose')
var IncomeSchema = require('../schemas/income')
var Income = mongoose.model('income', IncomeSchema)

module.exports = Income