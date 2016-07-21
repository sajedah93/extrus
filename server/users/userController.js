var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');
var Message = require('../messages/messageModel.js')
module.exports = {

	forgetPassUser : function(req,res){

    // Small Bug here 
    // Before our condition start if the user has an email
    // an edge case would be if we have more than a user with the same email
    // so the return would be the first object would obtain 
    // I exchanged instead of the condition checking the email first
    // it checks the username if available
    // and by that you can return the right Object to our client

    ////////////////////////////////////////////////////////////////
    //NOTE  : TODO // make this method when called . send to our admin that this users new password is
    // what we tell it to be . and he can take it from there
    ////////////////////////////////////////////////////////////////
		var key, data;
    if(req.body.username){
      key = 'username';
      data = req.body.username;
    } else {
      key = 'email';
      data = req.body.email;
    }
		User.findOne({[key]:data})
			.exec(function(error, user){
        if(error || !user){
          res.status(500).send(error || 'User Not Found');
        } else {
          
          user.password = Math.floor((Math.random()* 1000))+ "RbK" + Math.floor((Math.random()* 1000)); // setting the new password
          var newMessage = new Message({ // sending message to admin with the new password before being hashed by bcrypt
            from : 'Server' ,
            to : 'admin' , 
            text : 'Student ' + user.username + ' have forgotten his password .\nNew Password is ' + user.password
            // Now message have been sent to the admin from the server . 
            // if we check all messages from the Server to admin .. we will find that admin have gotten a message with
            // the students new password
          })
				  newMessage.save(function(err, saved){ // save the message
            if(err){
              return res.status(500).send('Could not send message to Admin')
            } else { // if message is sent successfully then save the user's password and bcrypt it
              user.save(function(err, newPassword){
                if(err){
                  return res.status(500).send('Could not send message to Admin')
                } else { // if success . send a response message wrapped in result object so can be dragged out in front end easily
                  return res.status(201).send({result : 'Your new Password is with Instructors . Please ask them to get it.'})    
                }
              })
              
            }
          })
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
            newObj.gitHub = users[i].gitHub;  // Added a gitHub on creation
            newObj.employed = users[i].employed; // Added a Boolean to check if employed
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
          image: req.body.image || 'http://i.imgur.com/FlEXhZo.jpg?1',
          gitHub : req.body.gitHub ,  // Add your gitHub account and is optional
          employed : req.body.employed || false, //  Add if employed , if left empty then by default would be false;
          counter : 0 , 
          pairReflect :  0
        });
        
        newUser.save(function(err, newUser){
          if(err){
            res.status(500).send(err);
          } else {
            res.status(200).send(newUser);
          };
        });
      } else {
        res.send(500,'User Already Exists');
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
          user.employed = req.body.employed || user.employed; // Edit if employed 
          user.gitHub = req.body.gitHub || user.gitHub; // Edit your gitHub repo if needed.
          user.pairReflect = req.body.pairReflect || user.pairReflect; // Set up the pair Reflect
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
  },

  pairReflectCalculator : function(req,res){
    
    var username  = req.body.username; // takes username (string) as body 
    var reflection  = req.body.pairReflect; //  takes pairReflect (number) as body

    // if front end accidentally sends a string . 
    if(typeof reflection === 'string'){
      // convert it into a number .
      reflection = JSON.parse(reflection);
    }

    // TODO Make the function 
    // work one time for every user 
    // so that not every user can rate more than one time
    // probably make a new table of pair reflection .

    User.findOne({username: req.body.username})
      .exec(function(err , user){
        if(err){
          return res.status(500).send('User not Found');
        } else {
          if(reflection){
            user.counter++;
            user.pairReflect+= reflection;
            user.save(function(err , userUpdated){
              if(userUpdated){
                var average = user.pairReflect / user.counter;
                res.status(201).send({average:average})
              }
            })
          }
        }
      })
          // when user post a pairReflect of 5 
          // we add 1 to the counter of the user who added this
          // then divide 5 by the counter
          // so the next time a new user will enter 
          // we will add his next rating which is a maximum of 10 
          // so 10 will add to 5 which is 15 / 2 equal to 7.5 
          // everytime the number will be rated 10 or less
          // now at front end you can rate 5 stars and each star would indicate 2 points
  }
};




