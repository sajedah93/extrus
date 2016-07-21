angular.module('RBKme.auth', [])

.controller('AuthController', function ($scope, $window, $location, $mdDialog, $mdMedia, Auth, Dialogs) {
  
  $window.username = '';

  $scope.user = {};

  // A flag to check if inputs filled or not
  $scope.filled = true;

  $scope.signin = function () {

    	$scope.filled = true;

    	if(!$scope.user.username || !$scope.user.password){
        $scope.filled = false;
        $scope.user.username = '';
        $scope.user.password = '';
        $scope.errorMsg = 'Please fill all fields';
    	} else {
    	    Auth.signin($scope.user)
    	      .then(function (token) {
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

  $scope.signout = function () {
    $window.username = '';
    Auth.signout();
  };

  $scope.forgotPassword = function (ev) {
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

   $scope.requestPass = function(){
    var objToSend = {};
    $scope.filled = true;
    if(!$scope.user.forogtUser && !$scope.user.forgotEmail){
      $scope.filled = false;
      $scope.errorMsg = 'Please fill one of the boxes';
    } else {
      if($scope.user.forogtUser){
        objToSend.username = $scope.user.forogtUser;
      } else if($scope.user.forgotEmail){
        objToSend.email = $scope.user.forgotEmail;
      }
      Auth.forgotPassword(objToSend)
      .then(function(response){
        console.log(response);
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
