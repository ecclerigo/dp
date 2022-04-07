this.addEventListener('message', function (e) {
    console.log(e);
    this.close();
}.bind(this));