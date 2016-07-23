angular.module('RBKme.msgHistory', [])

.controller('msgHistoryController', function ($scope, $mdDialog, Messages, Users, fromToObj , $route) {

	$scope.data = {};
	$scope.user = {};
	$scope.friend = {};
	$scope.initalize = function(){
		Messages.getMessages(fromToObj)
		.then(function(response){
			$scope.data.msgs = response;
			Users.getAll()
			.then(function(users){
				var counter = 0;
				var flag = true;
				// getting the friend object, and the user object from the database
				// to extract later the image and other properties for each
				// user and use the data in the msg history box
				for(var i=0; i<users.length; i++){
					if(users[i].username === fromToObj.username){
						$scope.user = users[i];
						counter++;
					} else if(users[i].username === fromToObj.friend){
						$scope.friend = users[i];
						counter++;
					} else if(fromToObj.friend === 'Server' && flag){
						flag = false;
						$scope.friend = {image: 'http://i.imgur.com/FlEXhZo.jpg?1',username:'Server'};
						counter++;
					}
					if(counter >= 2){
						break;
					}
				}
			})
			.catch(function(error){
				console.log(error);
			});
		})
		.catch(function(error){
			console.log(error);
		});
	}

	setInterval(function(){
		$scope.initalize();
	},500)

    $scope.myFunc = function (text) {
      var sendObject = {
      	from : window.username , 
      	to : $scope.friend.username ,
      	text : text
      }

      Messages.sendMessage(sendObject).then(function(response){
      	console.log(response);
      	$scope.initalize();	
      })
      $scope.textReply = '';
  	}


	$scope.hide = function() {
    	$mdDialog.hide();
	};
	
	$scope.cancel = function() {
    	$mdDialog.cancel();
	};

	$scope.initalize();
});