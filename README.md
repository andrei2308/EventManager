EventManager

EventManager is a web application for creating, managing, and tracking events. It provides features for user registration, login, creating events, and monitoring attendance, while ensuring security with JWT-based authentication and data integrity.
Features
1. User Management

    Register as a new user.
    Login using a secure authentication system (JWT-based).
    Role-based access: Users can be organizers or participants.
    View and manage user details.

2. Event Management

    Create and manage events with the following details:
        Name
        Description
        Start and end time
        Unique access code (can be represented as QR codes).
    Group events under a single category.
    Set events as OPEN or CLOSED based on time.

3. Attendance Tracking

    Participants can mark attendance by entering a unique access code or scanning a QR code.
    Organizers can view and export attendance data (CSV/XLSX).
    Track when each participant confirmed attendance.

Tech Stack
Frontend

    React: For building dynamic user interfaces.
    React Router: For routing within the application.
    Axios: For making HTTP requests to the backend.

Backend

    Node.js: Server-side runtime.
    Express.js: Backend framework for API development.
    Mongoose: ODM for MongoDB.

Database

    MongoDB: For storing user data, event details, and attendance records.

Security

    JWT: For secure authentication.
    bcrypt.js: For hashing passwords.

Installation

    Clone the Repository

git clone https://github.com/andrei2308/EventManager.git
cd EventManager

Install Dependencies

npm install

Set Up Environment Variables Create a .env file in the root directory and add the following variables:

MONGO_URI=mongodb://localhost:27017/eventmanager
JWT_SECRET=your_jwt_secret
PORT=10001

Run the Server

npm start

Run the Frontend Navigate to the frontend directory (if applicable) and start the development server:

    npm start

Endpoints
Authentication

    POST /register
    Register a new user.
    Request body: { username, password, email }

    POST /login
    Log in and receive a JWT token.
    Request body: { username, password }

User

    GET /user
    Get user details (requires authentication).

Events

    POST /events
    Create a new event (requires organizer role).
    Request body: { name, description, start_time, end_time, access_code, group }

    GET /events
    Retrieve a list of all events.

File Structure

EventManager/
├── src/
│   ├── api-routes/            # Backend route handlers
│   ├── components/            # React components (UserPage, Events, etc.)
│   ├── Schemas/               # Mongoose schemas for MongoDB
│   │   ├── AttendanceSchema.js
│   │   ├── EventGroupSchema.js
│   │   ├── EventSchema.js
│   │   ├── UserSchema.js
│   ├── App.js                 # Main React component
│   ├── server.js              # Express server entry point
├── public/                    # Static files
├── .env                       # Environment variables
├── package.json               # Node.js dependencies
└── README.md                  # Project documentation

How to Use
1. Register and Login

    Open the application in your browser.
    Register as a new user or log in with an existing account.

2. Create an Event

    Navigate to the "Create Event" page.
    Fill in the event details and submit.

3. View Events

    Browse the list of events as an organizer or participant.

4. Mark Attendance

    Participants can mark their attendance by entering the unique access code or scanning a QR code.

Future Improvements

    Add notifications and reminders for upcoming events.
    Enable uploading and displaying event images.
    Support recurring events with customizable intervals.
    Improve mobile responsiveness.

Contributing

Contributions are welcome! To contribute:

    Fork the repository.
    Create a new branch for your feature or bug fix.
    Submit a pull request.

License

This project is licensed under the MIT License.
