this.addEventListener('message', function (e) {
	console.log('Message received: ' + e.data);
});

let i = 0;

setInterval(function () {
	this.postMessage('counter value: ' + i++);
}.bind(this), 500);