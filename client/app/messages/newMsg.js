angular.module('RBKme.newMsg', [])

.controller('newMsgController', function ($scope, $mdDialog, Messages,friends) {

	$scope.msg = {};
	$scope.friends = friends;
	// A flag to check if inputs filled or not
	$scope.filled = true;
	
	$scope.hide = function() {
    	$mdDialog.hide();
	};
	
	$scope.cancel = function() {
    	$mdDialog.cancel();
	};

	$scope.answer = function() {

		$scope.filled = true;
		if(!$scope.msg.to || !$scope.msg.text){
			handleInputs($scope,'Please fill all fields');
		} else {
			$scope.msg.from = window.username;
			Messages.sendMessage($scope.msg)
			.then(function(response){
				if(response.status === 201){
					$mdDialog.hide({username: $scope.msg.to});
				} else {
					alert('Something Went Wrong, Please Try Again!');
				}
				clearInputBoxes($scope);
			})
			.catch(function(error){
				console.log(error);
			});
		}
	};
});

var handleInputs = function($scope, msg){
	clearInputBoxes($scope);
	$scope.filled = false;
	$scope.errorMsg = msg;
};

// function to clear the input boxes
var clearInputBoxes = function($scope) {
	$scope.msg.to = '';
	$scope.msg.text = '';
};
