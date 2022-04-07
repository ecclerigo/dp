"use strict";
let express = require('express');
let app = express();

app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

let words = [];

app.post('/api/words', function (req, res) {
	let data = '';
	req.on('data', function (chunk) {
		data += chunk.toString();
	});

	req.on('end', function () {
		words.push(data);
		res.writeHead(201, 'OK', {
			'Location': '/api/words/' + (words.length-1)
		});
		res.end();
	});
	 
});

app.get('/api/words/:id', function (req, res) {
	let id = req.params.id;
	let data = words[id];

	if (data) {
		res.statusCode = 200;
		res.end(data);
	} else {
		res.statusCode = 400;
		res.end();
	}
})

let port = 8000;

app.listen(port, function () {
	console.log('Server is running on port: ' + port);
});