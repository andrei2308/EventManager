require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const { initialize } = require('express-openapi');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: { url: 'http://localhost:10001/openapi.json' },
}));


app.get('/openapi.json', (req, res) => {
    res.json(app.apiDoc);
});


const apiDoc = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
        description: 'A simple API using express-openapi',
    },
    paths: {
        '/hello': {
            get: {
                summary: 'Get a greeting',
                description: 'Returns a simple greeting message.',
                responses: {
                    200: {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Hello, world!',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

app.apiDoc = apiDoc;

initialize({
    app,
    apiDoc,
    app,
    apiDoc: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A simple API using express-openapi',
        },
        paths: {
            '/hello': {
                get: {
                    summary: 'Get a greeting',
                    description: 'Returns a simple greeting message.',
                    responses: {
                        200: {
                            description: 'Successful response',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Hello, world!',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    paths: path.resolve(__dirname, './api-routes'),
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}, waiting for requests. . .`);
});
