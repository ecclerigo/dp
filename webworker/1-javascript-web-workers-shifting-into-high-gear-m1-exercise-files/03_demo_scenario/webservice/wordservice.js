"use strict";
let SERVER_PORT = 9000;

let restify = require('restify');
let fs = require('fs');
let os = require('os');
let server = restify.createServer();

server.use(restify.CORS());

let words = null;

let data = fs.readFileSync(__dirname + '/wordlist.txt');
words = data.toString().split(new RegExp('\\s|' + os.EOL));
words = words.map(function (word) {
	return word.toLowerCase();
});

function getWord(req, res, next) {
	let word = req.params.word.toLowerCase();
	res.send(words.indexOf(word) !== -1);

	next();
}

server.get('/words/:word', getWord);

function unknownMethodHandler(req, res) {
	if (req.method.toUpperCase() === 'OPTIONS') {
		console.log('Received an options method request from: ' + req.headers.origin);
		let allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization'];

		if (res.methods.indexOf('OPTIONS') === -1) {
			res.methods.push('OPTIONS');
		}

		res.header('Access-Control-Allow-Credentials', false);
		res.header('Access-Control-Expose-Headers', true);
		res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
		res.header('Access-Control-Allow-Methods', res.methods.join(', '));
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Max-Age', 1209600);

		return res.send(204);
	}
	else {
		return res.send(new restify.MethodNotAllowedError());
	}
}
server.on('MethodNotAllowed', unknownMethodHandler);

server.listen(SERVER_PORT, function () {
	console.log('Server is up and listening on port: ' + SERVER_PORT);
});