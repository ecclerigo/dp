define(['./views/ShellView',
	'./model/wordFinder'],
	function (ShellView, wordFinder) {
		let shell = new ShellView(null, 'shell');
		wordFinder.serviceUrl ='http://localhost:9000';
		shell.startup();
	}
);