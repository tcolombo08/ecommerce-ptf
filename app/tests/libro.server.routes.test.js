'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Libro = mongoose.model('Libro'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, libro;

/**
 * Libro routes tests
 */
describe('Libro CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Libro
		user.save(function() {
			libro = {
				name: 'Libro Name'
			};

			done();
		});
	});

	it('should be able to save Libro instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Libro
				agent.post('/libros')
					.send(libro)
					.expect(200)
					.end(function(libroSaveErr, libroSaveRes) {
						// Handle Libro save error
						if (libroSaveErr) done(libroSaveErr);

						// Get a list of Libros
						agent.get('/libros')
							.end(function(librosGetErr, librosGetRes) {
								// Handle Libro save error
								if (librosGetErr) done(librosGetErr);

								// Get Libros list
								var libros = librosGetRes.body;

								// Set assertions
								(libros[0].user._id).should.equal(userId);
								(libros[0].name).should.match('Libro Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Libro instance if not logged in', function(done) {
		agent.post('/libros')
			.send(libro)
			.expect(401)
			.end(function(libroSaveErr, libroSaveRes) {
				// Call the assertion callback
				done(libroSaveErr);
			});
	});

	it('should not be able to save Libro instance if no name is provided', function(done) {
		// Invalidate name field
		libro.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Libro
				agent.post('/libros')
					.send(libro)
					.expect(400)
					.end(function(libroSaveErr, libroSaveRes) {
						// Set message assertion
						(libroSaveRes.body.message).should.match('Please fill Libro name');
						
						// Handle Libro save error
						done(libroSaveErr);
					});
			});
	});

	it('should be able to update Libro instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Libro
				agent.post('/libros')
					.send(libro)
					.expect(200)
					.end(function(libroSaveErr, libroSaveRes) {
						// Handle Libro save error
						if (libroSaveErr) done(libroSaveErr);

						// Update Libro name
						libro.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Libro
						agent.put('/libros/' + libroSaveRes.body._id)
							.send(libro)
							.expect(200)
							.end(function(libroUpdateErr, libroUpdateRes) {
								// Handle Libro update error
								if (libroUpdateErr) done(libroUpdateErr);

								// Set assertions
								(libroUpdateRes.body._id).should.equal(libroSaveRes.body._id);
								(libroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Libros if not signed in', function(done) {
		// Create new Libro model instance
		var libroObj = new Libro(libro);

		// Save the Libro
		libroObj.save(function() {
			// Request Libros
			request(app).get('/libros')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Libro if not signed in', function(done) {
		// Create new Libro model instance
		var libroObj = new Libro(libro);

		// Save the Libro
		libroObj.save(function() {
			request(app).get('/libros/' + libroObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', libro.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Libro instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Libro
				agent.post('/libros')
					.send(libro)
					.expect(200)
					.end(function(libroSaveErr, libroSaveRes) {
						// Handle Libro save error
						if (libroSaveErr) done(libroSaveErr);

						// Delete existing Libro
						agent.delete('/libros/' + libroSaveRes.body._id)
							.send(libro)
							.expect(200)
							.end(function(libroDeleteErr, libroDeleteRes) {
								// Handle Libro error error
								if (libroDeleteErr) done(libroDeleteErr);

								// Set assertions
								(libroDeleteRes.body._id).should.equal(libroSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Libro instance if not signed in', function(done) {
		// Set Libro user 
		libro.user = user;

		// Create new Libro model instance
		var libroObj = new Libro(libro);

		// Save the Libro
		libroObj.save(function() {
			// Try deleting Libro
			request(app).delete('/libros/' + libroObj._id)
			.expect(401)
			.end(function(libroDeleteErr, libroDeleteRes) {
				// Set message assertion
				(libroDeleteRes.body.message).should.match('User is not logged in');

				// Handle Libro error error
				done(libroDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Libro.remove().exec();
		done();
	});
});