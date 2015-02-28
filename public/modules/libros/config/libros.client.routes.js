'use strict';

//Setting up route
angular.module('libros').config(['$stateProvider',
	function($stateProvider) {
		// Libros state routing
		$stateProvider.
		state('listLibros', {
			url: '/libros',
			templateUrl: 'modules/libros/views/list-libros.client.view.html'
		}).
		state('createLibro', {
			url: '/libros/create',
			templateUrl: 'modules/libros/views/create-libro.client.view.html'
		}).
		state('viewLibro', {
			url: '/libros/:libroId',
			templateUrl: 'modules/libros/views/view-libro.client.view.html'
		}).
		state('editLibro', {
			url: '/libros/:libroId/edit',
			templateUrl: 'modules/libros/views/edit-libro.client.view.html'
		});
	}
]);