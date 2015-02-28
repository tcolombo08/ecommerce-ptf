'use strict';

// Libros controller
angular.module('libros').controller('LibrosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Libros',
	function($scope, $stateParams, $location, Authentication, Libros) {
		$scope.authentication = Authentication;

		// Create new Libro
		$scope.create = function() {
			// Create new Libro object
			var libro = new Libros ({
				name: this.name,
                isbn: this.isbn,
                editorial: this.editorial
			});

			// Redirect after save
			libro.$save(function(response) {
				$location.path('libros/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.isbn = '';
                $scope.editorial = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Libro
		$scope.remove = function(libro) {
			if ( libro ) { 
				libro.$remove();

				for (var i in $scope.libros) {
					if ($scope.libros [i] === libro) {
						$scope.libros.splice(i, 1);
					}
				}
			} else {
				$scope.libro.$remove(function() {
					$location.path('libros');
				});
			}
		};

		// Update existing Libro
		$scope.update = function() {
			var libro = $scope.libro;

			libro.$update(function() {
				$location.path('libros/' + libro._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Libros
		$scope.find = function() {
			$scope.libros = Libros.query();
		};

		// Find existing Libro
		$scope.findOne = function() {
			$scope.libro = Libros.get({ 
				libroId: $stateParams.libroId
			});
		};
	}
]);