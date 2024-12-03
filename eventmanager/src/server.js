/** 
 * @file server.js
 * @description This file contains the server setup and API endpoints for the Event Manager application.
 * It uses Express for routing, Mongoose for MongoDB connection, and various middlewares for security and parsing.
 * It also includes JWT authentication and Swagger documentation setup.
 */
require('dotenv').config();
const mongodb = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyparser = require("body-parser");
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const User = require('./Schemas/UserSchema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @constant {Object} app - Express application instance.
 */
const app = express();

/**
 * Middleware setup.
 */
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
}));

/**
 * Connect to MongoDB.
 */
mongodb.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully!');
}).catch((err) => {
    console.error('Error connecting to MongoDB: ' + err);
});

/**
 * Middleware to authenticate JWT.
 */
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

/**
 * Swagger UI setup.
 */
const openApiSpecPath = path.join(__dirname, 'openapi.yaml');
const openApiSpec = fs.readFileSync(openApiSpecPath, 'utf8');

// Serve Swagger UI with YAML spec
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
        url: '/openapi.yaml'
    },
}));

// Serve YAML file at /openapi.yaml
app.get('/openapi.yaml', (req, res) => {
    res.type('application/x-yaml');
    res.send(openApiSpec);
});

/**
 * User login endpoint.
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
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
        res.status(500).json({ message: 'Server error during login: ' + error.message });
    }
});

/**
 * User registration endpoint.
 */
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
        res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
});

/**
 * Get user info endpoint.
 */
app.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User info', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching user data: ' + error.message });
    }
});

/**
 * Get events endpoint.
 */
app.get('/events', authenticateToken, (req, res) => {
    const events = [
        { id: 1, name: 'Event 1', date: '2024-12-01' },
        { id: 2, name: 'Event 2', date: '2024-12-05' },
    ];
    res.status(200).json({ events });
});

/**
 * Create event endpoint.
 */
app.post('/events', authenticateToken, (req, res) => {
    res.status(201).json({ message: 'Event created' });
});

/**
 * Start the server.
 */
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}, waiting for requests. . .`);
});
