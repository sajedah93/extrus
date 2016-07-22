angular.module('RBKme.profileView', [])

.controller('profileViewController', function ($scope, $window, $mdDialog, Users ,user , Auth) {
  	
	$scope.user = {};
	$scope.user = user;
  $scope.total = 0;

  if($scope.user.usersRating.length > 0){
    for(var i = 0; i < $scope.user.usersRating.length ; i++){
      $scope.total+= $scope.user.usersRating[i].rating;
    };
  }
	$scope.user.average = Math.floor($scope.total/user.counter) || 0;
  $scope.Rating = false;


  if(Auth.isAuth() && $window.username !== $scope.user.username){
    // If Authorized and token is available , then rating can be shown
    // And if the user logged in and the selected user are not equal to each other then show
    // else don't.
    $scope.Rating = true;
  	$scope.onItemRating = function(rating){
  		var obj = {  pairReflect : rating*2 , 
  					       username : user.username,
                   from : $window.username
  				};
  		Users.updatePair(obj); // This function updates the usersRating key.
      // After updating . get that username to update his total pair review.
      Users.getOne(user.username).then(function(response){
        $scope.total = 0;
        for(var i = 0; i < response.usersRating.length ; i++){
          $scope.total+= response.usersRating[i].rating;
        };
        $scope.user.counter = response.counter;
        $scope.user.average = Math.floor($scope.total/response.counter);
      })
  	};
  }

  if(user.employed){
    $scope.career="Yes, Thanks for Checking Up"
  } else{
    $scope.career="Not Yet"
  }   

  //  When page is unloaded then sign out 
  //  So you can no longer rate
  var unloadPage = function()
  {
    Auth.signout();
  }
  
  window.onunload = unloadPage;

	$scope.sameUser = function(){
		var token = $window.localStorage.getItem('com.RBKme');
		if(!token){
			return false;
		} else if($window.username !== $scope.user.username){
			return false;
		}
		return true;
	}

	$scope.hide = function() {
    	$mdDialog.hide();
	};
	
	$scope.cancel = function() {
    	$mdDialog.cancel();
	};

	// function to send back the answer to the main function
	// which is showProfile in the app.js to know whether you
	// want to edit the profile or not.
	$scope.answer = function(answer) {
    	$mdDialog.hide(answer);
	};
});

