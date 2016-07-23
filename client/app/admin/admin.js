angular.module('RBKme.admin', [])
.controller('adminController', function ($scope, Users) {
  	
  	$scope.user = {};
  	$scope.admin = {};

  	// a flag to know if we should give access or not for the admin to add users
  	$scope.giveAccess = false;

  	$scope.showError = false;
  	
    // logging in the user and checking for the credentials
  	$scope.login = function(){
  		$scope.showError = false;
  		if( $scope.admin.username === 'admin' && $scope.admin.password === 'P@SSW0RD' ){
  			$scope.giveAccess = true;
  		} else {
  			$scope.showError = true;
  			$scope.errorMsg = 'Wrong Credentials';
  		}
  		$scope.admin.username = '';
  		$scope.admin.password = '';
  	}

    // a function the admin can use to add users to the database
  	$scope.addUser = function(){
		$scope.user.cohortNumber = parseInt($scope.user.cohortNumber);
		Users.addOne($scope.user)
		.then(function(response){
			$scope.user.username = '';
			$scope.user.password = '';
			$scope.user.firstName = '';
			$scope.user.lastName = '';
			$scope.user.cohortNumber = '';
      $scope.user.image = '';
			console.log(response);
		})
		.catch(function(error){
			console.log(error);
		});
	};

  // Delete one user from daataBase. 
  $scope.deleteUser = function(){
    var obj = {
      username : $scope.username
    }
    Users.deleteOne(obj)
         .then(function(response){
          $scope.username = '';
          console.log(response);
         })
  }
});
