var Message = require('./messageModel.js');
var User = require('../users/userModel.js')

module.exports = {

	// Messages can be sent by anonymous users

	sendMessage : function(req,res){
		var message = {
			from : req.body.from || "Anonymous",
			to : req.body.to,
			text:  req.body.text,
			date : Date.now() // setting the date to the time the method is called
		};

		User.findOne({username : req.body.to})
			.exec(function(err, user){
				if(!user){
					res.status(500).send('Sorry , username is not available');
				} else {
					// Create new Message 
					var newMessage = new Message(message);
					newMessage.save(function(err,done){
						if(err){
							console.log(err)
						} else {
							res.status(201).send('Message have been sent successfully');
						}
					})
				}
			})

	},

	getAllMessages : function(req,res){
		Message.find().exec(function(err, allMessages){
			res.status(200).send(allMessages);
		})
	},

	getUserMessagedFriends : function(req,res){
		var username = req.body.username;
		Message.find({
			$or : [
			{from: username}, {to : username}
			]
		})
		.sort({ date : 1 })
		.exec(function(err, messages){
			// making a set to add unique usernames for the friends a user has been talking to
			var friendsSet = new Set();
			for(var i=0; i<messages.length; i++){
				if(messages[i].from === username){
					friendsSet.add(messages[i].to);
				} else  {
					friendsSet.add(messages[i].from)
				}
			}
			if(err){
				res.status(500).send('Message failed to get, Sorry')
			} else {
				// respond with OK plus an array of the friends the user has been talking to
				res.status(201).send(Array.from(friendsSet));
			}
		});
	},

	getMessage : function(req,res){
		var username = req.body.username;
		var friend = req.body.friend;
		Message.find({
			$or : [
			{from: username , to:friend}, {from : friend , to : username}
			]
		})
		.exec(function(err, messages){
			// This is just to check the messages in your terminal
			console.log("=========================================")
			console.log('Chat Log : ')
			console.log("=========================================")
			for(var i = 0 ; i< messages.length; i++){
				// showing messages in a neat way in back-end terminal
				console.log(messages[i].from + " says : "  + messages[i].text)
			}
			if(err){
				res.status(500).send('Message failed to get, Sorry')
			} else {
				// respond with OK plus all the messages between the user and its friend
				res.status(201).send(messages);
			}
		})
	}

}
