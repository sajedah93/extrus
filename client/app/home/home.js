angular.module('RBKme.home', [])

.controller('HomeController', function ($scope, $mdDialog, $mdMedia, Users, Auth, Dialogs) {
  $scope.status = '  ';
  $scope.data = {};

  // initalize function to get all the users from the database
  $scope.initalize = function(){
    // getting all the users and storing them in the $scope.data
    Users.getAll()
    .then(function(users){
      $scope.data.users = users;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  // function to show a single profile in a pop-up upon clicking on a profile pic
  $scope.showProfile = function(ev,user) {
    // for more info about the parameters we're passing here
    // check the documentation in the showDialog function
    // in the Dialogs factory in the services.js file
    Dialogs.showDialog($scope,$mdDialog,$mdMedia,
      'profileViewController','app/profile/profileView.html',ev,
      {user:user},function(answer){
        if(answer === 'Edit'){
          $scope.editProfile(ev,user);
        }
      },function(){
        $scope.status = 'You cancelled the dialog.';
      });
  };

  $scope.editProfile = function(ev,user) {
    // for more info about the parameters we're passing here
    // check the documentation in the showDialog function
    // in the Dialogs factory in the services.js file
    Dialogs.showDialog($scope,$mdDialog,$mdMedia,
      'profileEditController','app/profile/profileEdit.html',ev,
      {user:user},function(answer){
        $scope.showProfile(ev,user);
      },function(){
        $scope.status = 'You cancelled the dialog.';
      });
  };

  $scope.initalize();

});
