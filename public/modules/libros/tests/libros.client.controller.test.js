'use strict';

(function() {
	// Libros Controller Spec
	describe('Libros Controller Tests', function() {
		// Initialize global variables
		var LibrosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Libros controller.
			LibrosController = $controller('LibrosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Libro object fetched from XHR', inject(function(Libros) {
			// Create sample Libro using the Libros service
			var sampleLibro = new Libros({
				name: 'New Libro'
			});

			// Create a sample Libros array that includes the new Libro
			var sampleLibros = [sampleLibro];

			// Set GET response
			$httpBackend.expectGET('libros').respond(sampleLibros);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.libros).toEqualData(sampleLibros);
		}));

		it('$scope.findOne() should create an array with one Libro object fetched from XHR using a libroId URL parameter', inject(function(Libros) {
			// Define a sample Libro object
			var sampleLibro = new Libros({
				name: 'New Libro'
			});

			// Set the URL parameter
			$stateParams.libroId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/libros\/([0-9a-fA-F]{24})$/).respond(sampleLibro);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.libro).toEqualData(sampleLibro);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Libros) {
			// Create a sample Libro object
			var sampleLibroPostData = new Libros({
				name: 'New Libro'
			});

			// Create a sample Libro response
			var sampleLibroResponse = new Libros({
				_id: '525cf20451979dea2c000001',
				name: 'New Libro'
			});

			// Fixture mock form input values
			scope.name = 'New Libro';

			// Set POST response
			$httpBackend.expectPOST('libros', sampleLibroPostData).respond(sampleLibroResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Libro was created
			expect($location.path()).toBe('/libros/' + sampleLibroResponse._id);
		}));

		it('$scope.update() should update a valid Libro', inject(function(Libros) {
			// Define a sample Libro put data
			var sampleLibroPutData = new Libros({
				_id: '525cf20451979dea2c000001',
				name: 'New Libro'
			});

			// Mock Libro in scope
			scope.libro = sampleLibroPutData;

			// Set PUT response
			$httpBackend.expectPUT(/libros\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/libros/' + sampleLibroPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid libroId and remove the Libro from the scope', inject(function(Libros) {
			// Create new Libro object
			var sampleLibro = new Libros({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Libros array and include the Libro
			scope.libros = [sampleLibro];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/libros\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLibro);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.libros.length).toBe(0);
		}));
	});
}());