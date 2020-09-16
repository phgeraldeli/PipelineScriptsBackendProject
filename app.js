var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html'),
    swaggerJSDoc = require('swagger-jsdoc');

var swaggerDefinition = {
    info: {
        title: 'Javascript Backend API',
        version: '1.0.0',
        description: 'Aplicação de teste para o PipelineScripts',
    },
    host: 'http://127.0.0.1:3000',
    basePath: '/',
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['routes.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);


var log = function (entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url === '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            res.end();
        });
    } else {
        if (req.url === '/openapi') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(swaggerSpec));
        } else {
            res.writeHead(200);
            res.write(html);
            res.end();
        }
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
log('Server running at http://127.0.0.1:' + port + '/');

module.exports = {
    server : server
};
