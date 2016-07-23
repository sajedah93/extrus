angular.module('RBKme.auth', [])

.controller('AuthController', function ($scope, $window, $location, $mdDialog, $mdMedia, Auth, Dialogs) {
  
  $window.username = '';

  $scope.user = {};

  // A flag to check if inputs filled or not
  $scope.filled = true;

  // signing in the user
  $scope.signin = function () {

    	$scope.filled = true;

      // checking if all fields are filled or not
    	if(!$scope.user.username || !$scope.user.password){
        $scope.filled = false;
        $scope.user.username = '';
        $scope.user.password = '';
        $scope.errorMsg = 'Please fill all fields';
    	} else {
          // checking if the username and password are correct
    	    Auth.signin($scope.user)
    	      .then(function (token) {
              // saving a token so we can know a user has signed in
              // to give him access to multiple functionalities
              // on the website
    	        $window.localStorage.setItem('com.RBKme', token);
              $window.username = $scope.user.username;
              $scope.user.username = '';
              $scope.user.password = '';
    	        $mdDialog.hide('Success');
    	        $location.path('/');
    	      })
    	      .catch(function (error) {
              $scope.filled = false;
              $scope.user.username = '';
              $scope.user.password = '';
              $scope.errorMsg = 'Wrong Username or Password';
    	        console.error(error);
    	      });
    	 }
  };

  // signing the user out and removing the token saved previously
  // by calling the Auth.signout function
  $scope.signout = function () {
    $window.username = '';
    Auth.signout();
  };

  // Showing a pop-up for letting the user to ask for pasword reset
  $scope.forgotPassword = function (ev) {
    // for more info about the parameters we're passing here
    // check the documentation in the showDialog function
    // in the Dialogs factory in the services.js file
    Dialogs.showDialog($scope,$mdDialog,$mdMedia,
    'AuthController','app/auth/forgot.html',ev,
    {},function(answer){
      if(answer){
        console.log(answer);
        $location.path('/');
      }
    },function(){
      $location.path('/');
      $scope.status = 'You cancelled the dialog.';
    });
   };

   // requesting a password reset
   $scope.requestPass = function(){
    var objToSend = {};
    $scope.filled = true;
    // checking if one of the input boxes is filled
    if(!$scope.user.forogtUser && !$scope.user.forgotEmail){
      $scope.filled = false;
      $scope.errorMsg = 'Please fill one of the boxes';
    } else {
      // checking which input boxes in filled, to know whether you're requesting a password
      // based on your username or you email
      if($scope.user.forogtUser){
        objToSend.username = $scope.user.forogtUser;
      } else if($scope.user.forgotEmail){
        objToSend.email = $scope.user.forgotEmail;
      }
      // sending the request
      Auth.forgotPassword(objToSend)
      .then(function(response){
        console.log(response);
        alert(JSON.stringify(response.data.result));
      })
      .catch(function(error){
        console.log(error);
      });
      $scope.user.forogtUser = '';
      $scope.user.forgotEmail = '';
      $scope.hide();
    }
   };

   $scope.hide = function() {
    $mdDialog.hide();
   };
  
   $scope.cancel = function() {
    $mdDialog.cancel();
   };

});
