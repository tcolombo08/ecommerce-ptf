'use strict';

// Configuring the Articles module
angular.module('libros').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Libros', 'libros', 'dropdown', '/libros(/create)?');
		Menus.addSubMenuItem('topbar', 'libros', 'List Libros', 'libros');
		Menus.addSubMenuItem('topbar', 'libros', 'New Libro', 'libros/create');
	}
]);