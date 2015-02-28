'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Libro = mongoose.model('Libro'),
	_ = require('lodash');

/**
 * Create a Libro
 */
exports.create = function(req, res) {
	var libro = new Libro(req.body);
	libro.user = req.user;

	libro.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libro);
		}
	});
};

/**
 * Show the current Libro
 */
exports.read = function(req, res) {
	res.jsonp(req.libro);
};

/**
 * Update a Libro
 */
exports.update = function(req, res) {
	var libro = req.libro ;

	libro = _.extend(libro , req.body);

	libro.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libro);
		}
	});
};

/**
 * Delete an Libro
 */
exports.delete = function(req, res) {
	var libro = req.libro ;

	libro.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libro);
		}
	});
};

/**
 * List of Libros
 */
exports.list = function(req, res) { 
	Libro.find().sort('-created').populate('user', 'displayName').exec(function(err, libros) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(libros);
		}
	});
};

/**
 * Libro middleware
 */
exports.libroByID = function(req, res, next, id) { 
	Libro.findById(id).populate('user', 'displayName').exec(function(err, libro) {
		if (err) return next(err);
		if (! libro) return next(new Error('Failed to load Libro ' + id));
		req.libro = libro ;
		next();
	});
};

/**
 * Libro authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.libro.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
