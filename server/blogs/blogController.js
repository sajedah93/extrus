var Blog = require('./blogModel.js');
var Q = require('q');
// Promisify a few mongoose methods with the `q` promise library

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
		var newBlog = new Blog ({
			from : req.body.username,
			title : req.body.title,
			blog : req.body.blog
		});

		newBlog.save(function(err, newBlog){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(200).send(newBlog);
			};
		});
	}
}