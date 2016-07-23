angular.module('RBKme.msgHistory', [])

.controller('msgHistoryController', function ($scope, $mdDialog, Messages, Users, fromToObj) {

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
				for(var i=0; i<users.length; i++){
					if(users[i].username === fromToObj.username){
						$scope.user = users[i];
						counter++;
					} else if(users[i].username === fromToObj.friend){
						$scope.friend = users[i];
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

	$scope.hide = function() {
    	$mdDialog.hide();
	};
	
	$scope.cancel = function() {
    	$mdDialog.cancel();
	};

	$scope.initalize();
});