var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
	from: {type: String },
	to: {type : String },
	text: {type: String},
	date: { type: Date, default: Date.now }
});

var Message = mongoose.model('Message' , messageSchema);

module.exports = Message;