'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var libros = require('../../app/controllers/libros.server.controller');

	// Libros Routes
	app.route('/libros')
		.get(libros.list)
		.post(users.requiresLogin, libros.create);

	app.route('/libros/:libroId')
		.get(libros.read)
		.put(users.requiresLogin, libros.hasAuthorization, libros.update)
		.delete(users.requiresLogin, libros.hasAuthorization, libros.delete);

	// Finish by binding the Libro middleware
	app.param('libroId', libros.libroByID);
};
