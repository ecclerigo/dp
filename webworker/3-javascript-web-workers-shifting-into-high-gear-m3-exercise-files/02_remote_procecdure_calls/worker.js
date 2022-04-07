function add(l, r) {
    return l + r;
}

function subtract(l, r) {
    return l - r;
}

this.addEventListener('message', function (e) {
    let result = null;
    switch (e.data.type) {
        case 'add':
            result = add.apply(this, e.data.args);
            break;
        case 'subtract':
            result = subtract.apply(this, e.data.args);
    }

    this.postMessage({
        correlationId: e.data.correlationId,
        result: result
    });
});