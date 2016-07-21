angular.module('RBKme.newBlog', [])

.controller('newBlogController', function ($scope, $mdDialog, Blogs) {

	$scope.blog = {};
	
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
		if(!$scope.blog.title || !$scope.blog.blog){
			handleInputs($scope,'Please fill all fields');
		} else {
			$scope.blog.username = window.username;
			Blogs.addOne($scope.blog)
			.then(function(response){
				if(response.status === 200){
					clearInputBoxes($scope);
					$mdDialog.hide();
				} else {
					alert('Something Went Wrong, Please Try Again!');
				}
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
	$scope.blog.username = '';
	$scope.blog.title = '';
	$scope.blog.blog = '';
};