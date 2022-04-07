function add(l, r) {
    if (!parseFloat(l) || !parseFloat(r)) {
        throw 'Must have numeric inputs';
    }
    return l + r;
}

function subtract(l, r) {
    return l - r;
}

this.addEventListener('message', function (e) {
    let result = null;
    try {
        switch (e.data.type) {
            case 'add':
                result = {
                    isError: false,
                    value: add.apply(this, e.data.args)
                };
                break;
            case 'subtract':
                result = {
                    isError: false,
                    value: subtract.apply(this, e.data.args)
                };
        }
    } catch (e) {
        result = {
            isError: true,
            value: e
        }
    }

    this.postMessage({
        correlationId: e.data.correlationId,
        result: result
    });
});