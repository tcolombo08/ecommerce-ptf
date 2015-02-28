'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Libro Schema
 */
var LibroSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Libro name',
		trim: true
	},
    isbn: {
		type: String,
		default: '',
		required: 'Please fill ISBN',
		trim: true
	},
    editorial: {
		type: String,
		default: '',
		required: 'Please fill editorial',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Libro', LibroSchema);