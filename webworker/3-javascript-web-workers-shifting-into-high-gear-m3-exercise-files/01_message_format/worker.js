function add(l, r) {
    this.postMessage(l + r);
}

function subtract(l, r) {
    this.postMessage(l - r);
}

this.addEventListener('message', function (e) {
    switch (e.data.type) {
        case 'add':
            add.apply(this, e.data.args);
            break;
        case 'subtract':
            subtract.apply(this, e.data.args);
    }
});