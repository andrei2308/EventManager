require('dotenv').config();
const mongodb = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyparser = require("body-parser")
const helmet = require('helmet')

const swaggerUi = require('swagger-ui-express');
const { initialize } = require('express-openapi');
const path = require('path');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Schemas/UserSchema.js');

const app = express()
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(helmet({
    frameguard: {
        action: 'deny'
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ['style.com'],
        }
    },
    dnsPrefetchControl: false
}))
// Connect to MongoDB
mongodb.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB: ' + err);
    });
// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    console.log('Authenticating token...');
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;  // Store user info from the token
        next();
    });
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: { url: 'http://localhost:10001/openapi.json' },
}));


app.get('/openapi.json', (req, res) => {
    res.json(app.apiDoc);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        console.log('User found:', user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful!' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login: ' + error.message });
    }
});
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email, role: "participant", organizedEvents: [], participatedEvents: [] });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
});
app.get('/user', authenticateToken, async (req, res) => {
    console.log('User route hit');
    console.log('Decoded user from token:', req.user);
    try {
        const user = await User.findById(req.user.id);  // Retrieve user by ID from token payload
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User info', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching user data: ' + error.message });
    }
});
app.get('/events', authenticateToken, (req, res) => {
    console.log('Route /events hit by user:', req.user);

    const events = [
        { id: 1, name: 'Event 1', date: '2024-12-01' },
        { id: 2, name: 'Event 2', date: '2024-12-05' },
    ]; //mock data

    res.status(200).json({ events });
});
app.get('/events/create', authenticateToken, (req, res) => {
    console.log('Route /events/create hit by user:', req.user);

    res.status(200).json({ message: 'Create event' });
});
app.post('/events', authenticateToken, (req, res) => {
    console.log('Route /events hit by user:', req.user);
    console.log('Event data:', req.body);

    res.status(201).json({ message: 'Event created' });
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
        '/login': {
            post: {
                summary: 'User login',
                description: 'Authenticate user and return a JWT token.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' },
                                },
                                required: ['username', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Invalid username or password',
                    },
                    500: {
                        description: 'Server error during login',
                    },
                },
            },
        },
        '/register': {
            post: {
                summary: 'User registration',
                description: 'Register a new user.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' },
                                    email: { type: 'string' },
                                },
                                required: ['username', 'password', 'email'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Registration successful',
                    },
                    400: {
                        description: 'User already exists',
                    },
                    500: {
                        description: 'Server error during registration',
                    },
                },
            },
        },
        '/user': {
            get: {
                summary: 'Get user info',
                description: 'Retrieve information about the authenticated user.',
                responses: {
                    200: {
                        description: 'User info',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string' },
                                                username: { type: 'string' },
                                                email: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Access token missing or invalid',
                    },
                    404: {
                        description: 'User not found',
                    },
                    500: {
                        description: 'Server error fetching user data',
                    },
                },
            },
        },
    },
};

app.apiDoc = apiDoc;

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}, waiting for requests. . .`);
});

