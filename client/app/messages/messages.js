angular.module('RBKme.Msg', [])

.controller('MsgController', function ($scope, $mdDialog, $mdMedia, Users, Messages, Dialogs){

	$scope.data = {};

	// a function to get the list of messaged friends
	$scope.initalize = function(){
		Users.getAll()
		.then(function(users){
			$scope.data.friends = users;
			Messages.getMessagedFriends({username:window.username})
			.then(function(list){
				var MsgdFrineds = [];
				for(var i=0; i<list.length; i++){
					for(var j=0; j<users.length; j++){
						if(users[j].username === list[i]){
							MsgdFrineds.push(users[j]);
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