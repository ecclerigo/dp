let msg = null;

this.addEventListener('message', function (e) {
	console.log('Message received: ', e.data);
	msg = e.data;
});

setTimeout(function () {
	console.log('Message now: ', msg);
}, 1000);