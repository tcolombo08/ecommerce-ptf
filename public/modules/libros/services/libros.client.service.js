'use strict';

//Libros service used to communicate Libros REST endpoints
angular.module('libros').factory('Libros', ['$resource',
	function($resource) {
		return $resource('libros/:libroId', { libroId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);