define([
	'dojo/router'
],
	function (router) {
		let shell;
		
		// register a fallback handler for unknown routes 
		// that navigates to home page
		router.register('/*fallback', function () {
			shell.setView('home');
		});
		
		router.register('/', function () {
			shell.setView('home');
		});

		router.register('/results', function () {
			shell.setView('results');
		});



		return {
			startup: function (shellIn) {
				shell = shellIn;
				router.startup('/');
			}
		}
	}
);