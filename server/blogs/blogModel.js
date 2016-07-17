var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Blogs table here.
var blogSchema = new Schema({
	from : {type: String , required : true},
	title : {type : String , required: true},
	blog : {type : String , required: true}
});

var Blog = mongoose.model('Blog' ,  blogSchema);


module.exports = Blog;

