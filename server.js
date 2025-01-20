/**
 * @file server.js
 * @description This file contains the server setup and API endpoints for the Event Manager application.
 * It uses Express for routing, Mongoose for MongoDB connection, and various middlewares for security and parsing.
 * It also includes JWT authentication and Swagger documentation setup.
 */
require("dotenv").config();
const mongodb = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");
const User = require("./src/Schemas/UserSchema.js");
const Event = require("./src/Schemas/EventSchema.js");
const EventGroup = require("./src/Schemas/EventGroupSchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("./src/Jobs/cronJobs.js");
/**
 * @constant {Object} app - Express application instance.
 */
const app = express();

/**
 * Middleware setup.
 */
const allowedOrigins = [
  'http://localhost:8080', // Local development
  'https://andrei2308.github.io', // Production domain
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
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
const openApiSpecPath = path.join(__dirname, "openapi.yaml");
const openApiSpec = fs.readFileSync(openApiSpecPath, "utf8");

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
  const { redirect } = req.query; // Retrieve redirect URL if provided

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

    // Automatically add the user to the event if redirect contains an event ID
    if (redirect && redirect.startsWith('/events/')) {
      const eventId = redirect.split('/')[2]; // Extract event ID
      const event = await Event.findById(eventId);
      if (event) {
        event.participants.push({ id: user._id, name: user.username });
        await event.save();
      }
    }

    res.json({ token, message: 'Login successful!', user });
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
  const userId = req.user.id;
  // Find events where the organizer is NOT the current user and he is not attended
  Event.find({ organizer: { $ne: userId }, participants: { $not: { $elemMatch: { userId } } } })
    .then((events) => {
      res.json({ message: 'Events found', events });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Server error fetching events: ' + error.message });

    });
});

/**
 * Create event endpoint.
 */
app.post('/events', authenticateToken, async (req, res) => {
  const { name, description, start_time, end_time, access_code, group } = req.body;
  if (group === undefined) {
    const newEvent = new Event({ name, description, start_time, end_time, access_code, organizer: req.user.id });
    await newEvent.save();
    //get event id 
    const eventId = newEvent._id;

    res.json({ message: 'Event created successfully. Your event id is: ' + eventId, eventId });
  } else {
    const newEvent = new Event({ name, description, start_time, end_time, access_code, group, organizer: req.user.id });
    await newEvent.save();
    //get event id
    const eventId = newEvent._id;
    //return event id
    res.json({ message: 'Event created successfully. Your event id is: ' + eventId, eventId });
  }
});

app.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event found', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching event details: ' + error.message });
  }
});
app.get('/events/:eventId/join', async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Join event', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching event details: ' + error.message });
  }
});
app.post('/events/:eventId/join-guest', async (req, res) => {
  const { eventId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required for guest access.' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Add the guest to the event's participants list
    event.guests.push({ name, joinedAt: new Date() });
    await event.save();

    res.json({ message: 'Successfully joined the event as a guest.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error joining event as a guest: ' + error.message });
  }
});
app.post('/events/:eventId/join', authenticateToken, async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is already a participant
    const isAlreadyJoined = event.participants.some(participant =>
      participant.userId.toString() === req.user.id
    );
    if (isAlreadyJoined) {
      return res.status(400).json({ message: 'User already joined' });
    }

    // Add the user to the participants array
    event.participants.push({
      userId: req.user.id,
      joinedAt: new Date() // Set the current time as the join time
    });

    await event.save();

    res.json({
      message: 'Joined event successfully',
      joinedAt: new Date() // Return the join time to the user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error joining event: ' + error.message });
  }
});

app.get('/events/:eventId/participants', authenticateToken, async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Extract userIds and joinedAt timestamps
    const participantsData = event.participants.map(participant => ({
      userId: participant.userId,
      joinedAt: participant.joinedAt
    }));

    // Fetch user details from the User collection
    const userIds = participantsData.map(p => p.userId); // Extract userIds
    const users = await User.find({ _id: { $in: userIds } }, 'username email'); // Fetch only necessary fields

    // Combine user details with their joinedAt timestamps
    const participants = users.map(user => {
      const joinedAt = participantsData.find(p => p.userId.toString() === user._id.toString()).joinedAt;
      return {
        username: user.username,
        email: user.email,
        joinedAt
      };
    });
    const guests = event.guests;
    res.json({ message: 'Event participants', participants, guests });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching participants: ' + error.message });
  }
});

app.delete('/events/:eventId', authenticateToken, async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete event' });
    }
    await Event.findByIdAndDelete(eventId);

    // Additional cleanup (e.g., remove references to this event in user documents)
    await User.updateMany(
      { organizedEvents: eventId },
      { $pull: { organizedEvents: eventId } }
    );
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting event: ' + error.message });
  }
});
app.post('/group', authenticateToken, async (req, res) => {
  const { name, description, group } = req.body;
  const userId = req.user.id;
  try {
    const newGroup = new EventGroup({ name, description, organizer: userId, id: group });
    await newGroup.save();
    res.status(201).json({ message: 'Group created successfully. Your group id is: ' + newGroup.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating group: ' + error.message });
  }
});
app.get('/groups', authenticateToken, async (req, res) => {
  const userID = req.user.id;
  //we only search for groups that the user is not the organizer of
  EventGroup.find({ organizer: { $ne: userID } })
    .then((groups) => {
      res.json({ message: 'Groups found', groups });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Server error fetching groups: ' + error.message });
    });
});
app.get("/groups/details/:groupId", authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  try {
    const events = await Event.find({
      group: groupId,
      participants: { $not: { $elemMatch: { userId } } }
    });
    if (!events) {
      return res.status(404).json({ message: 'Events not found' });
    }
    res.json({ message: 'Events found', events });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching group details: ' + error.message });
  }
});
app.get('/groups/admin/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const groups = await EventGroup.find({ organizer: userId });
    res.json({ message: 'Groups found', groups });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user groups: ' + error.message });
  }
});
app.get('/events/admin/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const events = await Event.find({ organizer: userId });
    res.json({ message: 'Events found', events });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user events: ' + error.message });
  }
}
);
app.get('/events/details/admin/:eventId', authenticateToken, async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event found', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching event details: ' + error.message });
  }
});
app.get('/events/admin/groups/:groupId', authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  try {
    const events = await Event.find({ group: groupId });
    if (!events) {
      return res.status(404).json({ message: 'Events not found' });
    }
    res.json({ message: 'Events found', events });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching group events: ' + error.message });
  }
});
app.get('/groups/admin/export/participants/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const groups = await EventGroup.find({ organizer: userId });
    const groupIds = groups.map(group => group.id);
    const events = await Event.find({ group: { $in: groupIds } });
    const participants = events.map(event => event.participants).flat();
    const users = await User.find({ _id: { $in: participants.map(p => p.userId) } }, 'username email');
    res.json({ message: 'Participants found', users });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching participants: ' + error.message });
  }
});
app.get('/events/attended/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const events = await Event.find({ participants: { $elemMatch: { userId } } });
    res.json({ message: 'Attended events found', events });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching attended events: ' + error.message });
  }
});
/**
 * Start the server.
 */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}, waiting for requests. . .`);
});
