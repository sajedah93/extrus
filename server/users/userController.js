var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');

// Promisify a few mongoose methods with the `q` promise library
var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);
var findAllUsers = Q.nbind(User.find , User);

module.exports = {

	forgetPassUser : function(req,res,next){
		var username = req.body.username;
		var email = req.body.email;

		findUser({$or:[{username:username},{email:email}]})
			.then(function(user){
				res.json(user);
			})
			.fail(function(error){
				next(error);
			});
	},

	getAllUsers: function(req,res,next){
		findAllUsers({})
			.then(function(users){
				res.json(users)
			})
			.fail(function(error){
				next(error);
			})
	},



	signin: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function (foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  newUser: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var age = req.body.age;
    var cohort = req.body.cohortNumber;
    var image = req.body.image || '';

    // check to see if user already exists
    findUser({username: username})
      .then(function (user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          // make a new user if not one
          return createUser({
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            age: age,
            cohortNumber: cohort,
            image: image
          });
        }
      })
      .then(function (user) {
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },	

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  },

  editProfile : function(req,res,next){
    findUser({username: req.body.username})
      .then( function(user){
        if(!user){
          return next(new Error ('User not added Yet'))
        }
        user.password = req.body.password || user.password;
        user.email = req.body.email || user.email;
        user.firstName = req.body.firstname || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.age = req.body.age || user.age;
        user.image = req.body.image || user.image;

        user.save(function(err,savedUser){
          if(err){
            next(err);
          } else {
            console.log('User Updated');
          }
        });
      })
      .fail(function (error){
        next(error);
      });
  }


};




