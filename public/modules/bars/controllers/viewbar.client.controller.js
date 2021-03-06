'use strict';

angular.module('bars').controller('ViewBarsController', ['$scope', '$stateParams', '$location', 'Bars', 'uiGmapGoogleMapApi', 'Reviews',
	function($scope, $stateParams, $location, Bars, uiGmapGoogleMapApi, Reviews) {
        $scope.testsys = true;
		$scope.max = 5;
        $scope.rating = 3;
        $scope.noReviews = false;
        $scope.newReviews = {rating: 3, review: '', good: 0, bad: 0};
        $scope.reviews = [];
        $scope.currentPage = 1;
        $scope.maxSize=5;
        
        $scope.map = { center: { latitude: 34.0451919, longitude: -118.2611465 }, zoom: 15 };
        $scope.marker = { id:0, coords: {latitude: 34.0451919, longitude: -118.2611465 }, options: {draggable: false}, events: {} };
        
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
        
        $scope.pageChanged = function () {
            $scope.reviews = Reviews.query({barId: $scope.bar._id, page: $scope.currentPage});
        };
        
        $scope.goodReview = function (upreview){
        	upreview.good = upreview.good + 1;
        	var review = new Reviews(
				upreview
			);
			review.$update(function(response) {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        	
        };
        $scope.badReview = function (upreview){
        	upreview.bad = upreview.bad + 1;
        	var review = new Reviews(
				upreview
			);
			review.$update(function(response) {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        	
        };
        
        $scope.removeReview = function (newReview, index){
        	var review = new Reviews(newReview);
  	      	 review.$remove(function(response) {
  	      	 	$scope.reviews.splice(index, 1);
  	      	 }, function(errorResponse) {
  	      	 	$scope.error = errorResponse.data.message;
  	      	 });
        };
        
        //TODO $scope.markAsFavorite = function (bar)  user sets bar as fav

		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
			$scope.percent = 100 * (value / $scope.max);
		};
        
        $scope.addReview = function(bar){
			//$scope.newReviews.user = $rootScope.username;
			$scope.newReviews.barName = $scope.bar.name;
			$scope.newReviews.barID = $scope.bar._id;
			var review = new Reviews($scope.newReviews);
			review.$save(function(response) {
                $scope.reviews.push(review);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.newReviews = {rating: 3, review: '', good: 0, bad: 0};
        };
        
		$scope.remove = function(bar) {
			if (bar) {
				bar.$remove();

				for (var i in $scope.bars) {
					if ($scope.bars[i] === bar) {
						$scope.bars.splice(i, 1);
					}
				}
				$location.path('bars');
			} else {
				$scope.bar.$remove(function() {
					$location.path('bars');
				});
			}
		};
		
		$scope.edit = function() {
			$location.path('bars/'+$scope.bar._id+'/edit');
		};

		$scope.findOne = function() {
			if($stateParams.barId === '')
				$location.path('bars');
			$scope.bar = Bars.get({
				barId: $stateParams.barId
			}, function(){
				$scope.marker.coords.latitude = $scope.bar.address.latCoord;
				$scope.marker.coords.longitude = $scope.bar.address.longCoord;
				$scope.map.center.latitude = $scope.bar.address.latCoord;
				$scope.map.center.longitude = $scope.bar.address.longCoord;
				$scope.totalReviews = $scope.bar.reviews.length;
				$scope.noReviews = ($scope.totalReviews === 0);
				if (!$scope.noReviews){
					$scope.bar.rating = $scope.bar.rating/$scope.totalReviews;
					$scope.reviews = Reviews.query({barId: $scope.bar._id, page: 1});
				}				
			});
			
			
		};
		
		uiGmapGoogleMapApi.then(function(maps) {}); 
	}
]);
