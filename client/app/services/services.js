angular.module('RBKme.services', [])

// Service for Users requests functions
.factory('Users', function ($http) {

  // function to get all the users from the database
  var getAll = function () {
    return $http({
      method: 'GET',
      url: '/api/users'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  // function to get a single user from the database
  var getOne = function (id) {
    return $http({
      method: 'GET',
      url: '/api/users/'+id
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  // function to add a single user to the database
  var addOne = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function (resp) {
      return resp;
    });
  };

  // function to save the edited info on the profile
  var editProfile = function (user) {
  	return $http({
      method: 'POST',
      url: '/api/users/editProfile',
      data : user
    })
    .then(function (resp) {
      return resp;
    });
  }

  var updatePair = function(user){
    return $http({
      method: 'POST', 
      url: '/api/users/pairReflect',
      data: user
    }).then(function(resp){
      return resp; 
    })
  }

  var deleteOne = function(user){
    return $http({
      method : 'POST', 
      url : '/api/users/delete', 
      data : user
    })
  }

  return {
    getAll: getAll,
    getOne : getOne,
    addOne: addOne,
    editProfile: editProfile,
    updatePair : updatePair,
    deleteOne : deleteOne
  };
})

// Service for Blogs requests functions
.factory('Blogs', function ($http) {

  // function to get all blogs
  var getAll = function () {
    return $http({
      method: 'GET',
      url: '/api/blogs'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  // function to add a single blog
  var addOne = function (blog) {
    return $http({
      method: 'POST',
      url: '/api/blogs',
      data: blog
    })
    .then(function (resp) {
      return resp;
    });
  };

  return {
    getAll: getAll,
    addOne: addOne
  };
})
.factory('Dialogs', function ($http) {
  // function to show the dialogs
  var showDialog = function($scope,$mdDialog,$mdMedia,controller,htmlTemplate,event,paramsObj,successCB,failureCB){

    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: controller,
      templateUrl: htmlTemplate,
      parent: angular.element(document.body),
      targetEvent: event,
      locals: paramsObj,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
      successCB(answer);

    }, function() {
      failureCB();
    });

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });

  };

  return {
    showDialog:showDialog
  };

})
.factory('Messages', function ($http) {
  var sendMessage = function (msg) {
    return $http({
      method: 'POST',
      url: '/api/users/sendMessage',
      data: msg
    })
    .then(function (resp) {
      return resp;
    });
  };
  
  var getMessagedFriends = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/getUserMessagedFriends',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  
  var getMessages = function (fromTo) {
    return $http({
      method: 'POST',
      url: '/api/users/getMessages',
      data: fromTo
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  return {
    sendMessage: sendMessage,
    getMessages: getMessages,
    getMessagedFriends: getMessagedFriends
  };
})
.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.RBKme');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.RBKme');
    $location.path('/');
  };

  // function to reset the password when you forget your password or username
  var forgotPassword = function (obj) {
    return $http({
      method: 'POST',
      url: '/api/users/forget',
      data : obj
    })
    .then(function (resp) {
      return resp;
    });
  };

  return {
    signin: signin,
    isAuth: isAuth,
    forgotPassword: forgotPassword,
    signout: signout
  };
});;
