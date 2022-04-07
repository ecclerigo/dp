let functions = {};

this.addEventListener('message', function (e) {
    let result = null;
    try {
        switch (e.data.type) {
            case 'registerFunction': 
                functions[e.data.name] = new Function(e.data.parameters, e.data.body);
                break;
            default:
                if (functions[e.data.type]) {
                    result = {
                        isError: false,
                        value: functions[e.data.type].apply(null, e.data.args)
                    };
                }
                break;
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