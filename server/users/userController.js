var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');

module.exports = {

	forgetPassUser : function(req,res){
		var key, data;
    if(req.body.email){
      key = 'email';
      data = req.body.email;
    } else {
      key = 'username';
      data = req.body.username;
    }

		User.findOne({[key]:data})
			.exec(function(error, user){
        if(error || !user){
          res.status(500).send(error || 'User Not Found');
        } else {
				  res.json(user);
        }
			});
	},

	getAllUsers: function(req,res){
		User.find({})
			.exec(function(error, users){
        if(error){
          res.status(500).send(error);
        } else {
          // TODO : SEND CERTAIN PROPERTIES OF USER
          var newArr = [];
          for(var i=0; i<users.length; i++){
            var newObj = {};
            newObj.username = users[i].username;
            newObj.email = users[i].email;
            newObj.firstName = users[i].firstName;
            newObj.lastName = users[i].lastName;
            newObj.age = users[i].age;
            newObj.cohortNumber = users[i].cohortNumber;
            newObj.image = users[i].image;
            newObj.About = users[i].About;
            newObj.pairReflect = users[i].pairReflect;
            newArr.push(newObj);
          }
				  res.json(newArr);
        }
			});
	},



	signin: function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username})
      .exec(function (error, user) {
        if(error){
          res.status(500).send(error);
        } else if (!user) {
          res.status(500).send(new Error('User does not exist'));
        } else {
          User.comparePassword(password,user.password, res, function(found){
            if(!found){
              res.status(500).send('Wrong Password');
            } else {
              var token = jwt.encode(user, 'secret');
              res.setHeader('x-access-token',token);
              res.json({token: token});
            }
          });
        }
      });
  },

  newUser: function (req, res) {
    User.findOne({username: req.body.username})
    .exec(function(error,user){
      if(error){
        res.status(500).send(error);
      } else if(!user){
        var newUser = new User ({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          age: req.body.age,
          cohortNumber: req.body.cohortNumber,
          image: req.body.image || 'http://i.imgur.com/FlEXhZo.jpg?1' 
        });
        
        newUser.save(function(err, newUser){
          if(err){
            res.status(500).send(err);
          } else {
            res.status(200).send(newUser);
          };
        });
      } else {
        res.status(500,'User Already Exists');
      }
    });
  },	

  checkAuth: function (req, res) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      res.status(500).send(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      User.findOne({username: user.username})
        .exec(function (error, foundUser) {
          if(error){
            res.status(500).send(error);
          } else if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        });
    }
  },

  editProfile : function(req,res){
    User.findOne({username: req.body.username})
      .exec( function(error, user){
        if(error){
          res.end(error);
        } else 
        if(!user){
          return next(new Error ('User not added Yet'))
        } else {

          user.email = req.body.email || user.email;
          user.firstName = req.body.firstName || user.firstName;
          user.lastName = req.body.lastName || user.lastName;
          user.age = req.body.age || user.age;
          user.image = req.body.image || user.image;

          if(req.body.oldPassword){
            User.comparePassword(req.body.oldPassword,user.password, res, function(found){
              if(!found){
                res.status(500).send('Wrong Password');
              } else {
                  user.password = req.body.password || user.password;

                  user.save(function(err,savedUser){
                    if(err){
                      res.status(500).send(error);;
                    } else {
                      res.status(200).send('User Updated');
                    }
                  });
              }
            });
          } else {
            user.save(function(err,savedUser){
              if(err){
                res.status(500).send(error);;
              } else {
                res.status(200).send('User Updated');
              }
            });
          }
        }
      });
  }
};




