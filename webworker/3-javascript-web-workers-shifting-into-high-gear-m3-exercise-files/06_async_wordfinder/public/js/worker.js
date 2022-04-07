let functions = {};

this.addEventListener('message', function (e) {

    let result = null;

    switch (e.data.type) {
        case 'config': 
            this.dojoConfig = e.data.options;
            break;
        case 'loadScript':
            importScripts(e.data.url);
            break;
        case 'registerFunction': 
            functions[e.data.name] = {
                isAsync: !!e.data.isAsync,
                func: new Function(e.data.parameters, e.data.body)
            }
            break;
        default:
            if (functions[e.data.type]) {
                if (functions[e.data.type].isAsync) {
                    functions[e.data.type].func.apply(null, e.data.args).then(function (result) {
                        this.postMessage({
                            correlationId: e.data.correlationId,
                            result: {
                                isError: false,
                                value: result
                            }
                        });
                    }, function (error) {
                        this.postMessage({
                            correlationId: e.data.correlationId,
                            result: {
                                isError: true,
                                value: error
                            }
                        });
                    });
                }
                
            } else {
                try {
                    value = functions[e.data.type].func.apply(null, e.data.args);

                    result = {
                        isError: false,
                        value: value
                    };
                } catch (e) {
                    result = {
                        isError: true,
                        value: e
                    };
                }

                this.postMessage({
                    correlationId: e.data.correlationId,
                    result: result
                });
            }
            break;
    }
        
});
