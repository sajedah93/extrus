angular.module('RBKme.profileEdit', [])

.controller('profileEditController', function ($scope, $mdDialog, Users, user) {
	
	$scope.user = {};
  	$scope.user = user;

	// Defining Password Boxes
  	$scope.oldPassword = '';
  	$scope.newPassword = '';
  	$scope.repeatNewPassword = '';

	// A flag to check if any data was changed while editing
	$scope.changedFlag = false;

	// A flag to check if passwords match or not
	$scope.matched = true;

	// function to chose a pic from the local disk
	// and upload it to imgur to get a link for
	// that pic and save it in the database
	$scope.changeProfilePic = function(){

		var uploadToIMGUR = window.uploadToIMGUR;
		var IMGUR_CLIENT_ID = window.IMGUR_CLIENT_ID;
		
		var fileBt = $('<input>').attr('type','file');
		fileBt.on('change', () => {
			var file = fileBt[0].files[0];
			var reader = new FileReader();
			reader.addEventListener('load', ()=>{
				var imgData = reader.result.slice(23);
				uploadToIMGUR(IMGUR_CLIENT_ID, imgData, function(result){
					$scope.user.image = result.link;
					$scope.changedFlag = true;
				});
			})
			reader.readAsDataURL(file);
		})
		fileBt.click();
	};

	$scope.hide = function() {
    	$mdDialog.hide();
	};
	
	$scope.cancel = function() {
		$scope.changedFlag = false;
    	$mdDialog.cancel();
	};

	// function to send back the answer to the main function
	// which is editProfile in the app.js to know whether you
	// want to save the changes to the profile or not.
	$scope.answer = function() {
		$scope.matched = true;
		if(!$scope.user.oldPassword && ($scope.user.password || $scope.repeatNewPassword)){

			handlePasswords($scope, 'Please Enter Old Password');
		}
		else if($scope.user.oldPassword && $scope.user.password !== $scope.repeatNewPassword){

			handlePasswords($scope, 'Passwords Don\'t Match');
		} else {
			Users.editProfile($scope.user)
			.then(function(response){
				if(response.status === 200){
					clearPasswordBoxes($scope);
					$mdDialog.hide($scope.user);
				}
			})
			.catch(function(error){
				if(error.status === 500){
					handlePasswords($scope, 'Wrong Password');
				}
			});
		}
	};
});

// function to output a msg for the user
// in case of unmatched new passwords or 
// wrong old password
var handlePasswords = function($scope, msg){
	clearPasswordBoxes($scope);
	$scope.matched = false;
	$scope.errorMsg = msg;
};

// function to clear the password boxes
var clearPasswordBoxes = function($scope) {
	$scope.user.oldPassword = '';
	$scope.user.password = '';
	$scope.repeatNewPassword = '';
};