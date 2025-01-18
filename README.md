---

# EventManager

**EventManager** is a complete web application dedicated to managing events and event groups. The application allows users to create, manage, and participate in events efficiently and intuitively. With advanced features and a modern interface, EventManager is suitable for both regular users and administrators.

---

## Features

### 1. **JWT-based Authentication**

- Secure authentication using JSON Web Tokens (JWT).
- Password hashing for increased security.
- Easy-to-use login and registration flow.

### 2. **Dedicated User Page**

- View available events.
- Join events by entering an access code or scanning a QR code.
- Access groups and events the user has participated in.

### 3. **Dedicated Admin Page**

- Create and manage events.
- Create and manage event groups.
- View event participants and export them as CSV/XLSX.
- Open and close events manually or automatically.

### 4. **Automated Event Handling (cronJob)**

- Automatically open and close events based on their start and end times using cron jobs.

### 5. **Group Events**

- Create groups to organize related events.
- View and access events within a specific group.

### 6. **Event Creation**

- Create custom events with the following details:
  - Event name.
  - Description.
  - Start and end date/time.
  - Automatically generate an access code.
  - Generate a unique QR code for easy access.

### 7. **Group Creation**

- Organize related events into groups for better management.
- View group details and associated events.

### 8. **Join Events via QR Code**

- Participate in events by scanning a unique QR code generated for each event.

### 9. **View and Export Participants**

- Export participant lists for events as CSV or XLSX files.
- Separate participants into registered users and guest attendees.

### 10. **Modern and Responsive Design**

- Interface built with **Material-UI (MUI)** for a sleek, modern, and responsive design.
- Clear separation of sections for users and administrators.
- Fully responsive design that adapts to different screen sizes.

---

## Technologies Used

- **Frontend**:
  - **React**: Dynamic, component-based interface.
  - **MUI (Material-UI)**: Modern, responsive design.
- **Backend**:
  - **Node.js & Express**: Application logic and REST API handling.
  - **MongoDB**: NoSQL database for storing users, events, and groups.
  - **JWT**: Secure authentication.
- **Other Libraries and Tools**:
  - **bcrypt**: Password hashing.
  - **Cron jobs**: Automate opening and closing events.
  - **QRCode.react**: Generate QR codes.

---

## Installation and Usage

### 1. **Clone the Repository**

```bash
git clone https://github.com/andrei2308/EventManager.git
cd EventManager
```

### 2. **Install Dependencies**

Install the required dependencies for both **frontend** and **backend**.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. **Configuration**

- Create a `.env` file in the backend directory with the following variables:
  ```env
  PORT=5000
  JWT_SECRET=your_jwt_secret_key
  MONGO_URI=your_mongodb_connection_string
  ```
- (Optional) Customize other configuration details as needed.

### 4. **Run the Application**

- Start the backend:
  ```bash
  cd backend
  npm start
  ```
- Start the frontend:
  ```bash
  cd frontend
  npm start
  ```

---

## Main Workflows

### User:

1. **Authentication**: Login/Register.
2. **View Events**: Access available events and groups.
3. **Participation**: Join events using access codes or QR codes.
4. **Export Data**: View and export attended events.

### Administrator:

1. **Create Events**: Add custom events with access codes and QR codes.
2. **Manage Groups**: Organize related events into

groups for better management. 3. **Participants Management**: View and export participant data as CSV or XLSX files. 4. **Automation**: Automatically open or close events based on their defined schedule.

---

## Screenshots (Optional)

Include relevant screenshots to demonstrate the application, such as:

1. Login and Registration Page.
2. User Dashboard.
3. Admin Dashboard.
4. Event Details Page.

---

## Contribution

1. Fork this repository.
2. Create a new branch (`feature/new-feature`).
3. Open a Pull Request (PR) for review.

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
