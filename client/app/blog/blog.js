angular.module('RBKme.blog', [])

.controller('BlogController', function ($scope, $mdDialog, $mdMedia, Blogs, Users, Auth, Dialogs) {
	$scope.data = {};

	// calling the isAuth function to know whether the user has signed in or not yet
	$scope.auth = Auth.isAuth;

	$scope.initalize = function(){

		Blogs.getAll()
		.then(function(blogs){
			$scope.data.blogs = blogs;
			Users.getAll()
			.then(function(users){
				for(var i=0; i<$scope.data.blogs.length; i++){
					for(var j=0; j<users.length; j++){
						if($scope.data.blogs[i].from === users[j].username){
							$scope.data.blogs[i].image = users[j].image;
							$scope.data.blogs[i].name = users[j].firstName + ' ' + users[j].lastName;
							break;
						}
					}
				}
			})
			.catch(function(error){
				console.log(error);
			});
		})
		.catch(function(error){
			console.log(errors);
		});
	};

	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	
	$scope.addPost = function(ev) {
	  Dialogs.showDialog($scope,$mdDialog,$mdMedia,
      'newBlogController','app/blog/newBlog.html',ev,
      {},function(answer){
        $scope.initalize();
      },function(){
        $scope.status = 'You cancelled the dialog.';
      });
  	};

	$scope.initalize();
});
