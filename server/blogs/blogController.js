var Blog = require('./blogModel.js');
var Q = require('q');
// Promisify a few mongoose methods with the `q` promise library

var createBlog = Q.nbind(Blog.create, Blog);
var findAllBlogs = Q.nbind(Blog.find, Blog);



module.exports = {
	getAllBlogs : function(req,res,next){
		findAllBlogs({})
				.then(function(blogs){
					res.json(blogs)
				}).fail(function(error){
					next(error);
				})
	},

	newBlog : function(req,res,next){
		var newBlog = {
			from : req.body.username,
			title : req.body.title,
			blog : req.body.blog
		}
		createBlog(newBlog)
		.then( function(created) {
			if(created){
				res.json(created);
			}
		})
		.fail( function(error) {
			next(error);
		});

	}
}