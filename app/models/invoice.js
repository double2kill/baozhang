var mongoose = require('mongoose')
var InvoiceSchema = require('../schemas/Invoice')
var Invoice = mongoose.model('Invoice', InvoiceSchema)

module.exports = Invoice