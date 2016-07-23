angular.module('RBKme.Msg', [])

.controller('MsgController', function ($scope, $mdDialog, $mdMedia, Users, Messages, Dialogs){

	$scope.data = {};

	// a function to get the list of messaged friends
	$scope.initalize = function(){
		Users.getAll()
		.then(function(users){
			$scope.data.friends = users;
			// getting list of the previous messaged friends
			Messages.getMessagedFriends({username:window.username})
			.then(function(list){
				var MsgdFrineds = [];
				for(var i=0; i<list.length; i++){
					for(var j=0; j<users.length; j++){
						if(users[j].username === list[i]){
							MsgdFrineds.push(users[j]);
						// special condition where the admin logs in, then all his messages would be from the Server
						// because the requested passwords would be send from the server to the admin inside a message
						} else if(window.username ==='admin' && list[j]==='Server'){
							MsgdFrineds.push({firstName:'Server',lastName:'',username:'Server'});
						}
					}
				}
				$scope.data.users = MsgdFrineds;
			})
			.catch(function(error){
				console.log(error);
			});
		})
		.catch(function(error){
			console.log(error);
		})
	};

	// a function to send a new message
	$scope.sendMsg = function(ev){
    // for more info about the parameters we're passing here
    // check the documentation in the showDialog function
    // in the Dialogs factory in the services.js file
		Dialogs.showDialog($scope,$mdDialog,$mdMedia,
	      'newMsgController','app/messages/newMsg.html',ev,
	      {friends: $scope.data.friends},function(answer){
	      	if(answer){
	        	$scope.showHistory(ev,answer);
	        }
	      },function(){
	        $scope.status = 'You cancelled the dialog.';
	      });
	};

	// a function to show the histoy of messages between two users
	$scope.showHistory = function(ev,friend){
    // for more info about the parameters we're passing here
    // check the documentation in the showDialog function
    // in the Dialogs factory in the services.js file
		Dialogs.showDialog($scope,$mdDialog,$mdMedia,
	      'msgHistoryController','app/messages/msgHistory.html',ev,
	      {fromToObj:{username: window.username, friend: friend.username}},
	      function(answer){
	      	if(answer){
	      		console.log(answer);
	      	}
	      },function(){
	        $scope.status = 'You cancelled the dialog.';
	      });
	}

	$scope.initalize();
});