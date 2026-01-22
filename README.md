# Road Accident Witness Hub 🚨

A full-stack MERN application for reporting and managing road accident data, featuring role-based dashboards for Administrators and Police Officers.

## 🌟 Features
-   **Public Portal**: Home, About, and Contact pages for general users.
-   **Role-Based Access**:
    -   **Admin (Red Theme)**: Global overview, report verification, system health.
    -   **Police (Blue Theme)**: Field overview, assignments, vehicle lookup.
-   **Secure Authentication**: JWT-based login with role redirection.
-   **Modern UI**: Glassmorphism design using React + Ant Design.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:

### 1. Git (Version Control)
*   **Download**: [git-scm.com](https://git-scm.com/downloads)
*   **Verify**: Open a terminal and run `git --version`

### 2. Node.js (Runtime)
*   **Download**: [nodejs.org](https://nodejs.org/) (LTS version recommended)
*   **Verify**: Run `node -v` and `npm -v`

### 3. MongoDB (Database)
You have two options:
*   **Option A: MongoDB Atlas (Cloud)** - Recommended for easiest setup.
    1.  Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
    2.  Create a stricture, database, and get your connection string.
*   **Option B: MongoDB Community Server (Local)**
    1.  **Download**: [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
    2.  **Install**: Follow the installer logic.
    3.  **Verify**: Run `mongod --version`

---

## 🚀 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/unnikrishnan-sics/Road-Accident-Witness-Hub.git
cd "Road Accident Witness Hub"
```

### 2. Backend Setup (Server)
Navigate to the server folder and install dependencies:
```bash
cd server
npm install
```

**Configuration**:
The server is pre-configured to connect to a local MongoDB instance by default.
-   Database Name: `road_accident_hub`
-   Port: `5000`
-   JWT Secret: `your_jwt_secret_key`

If you need to change these, create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/road_accident_hub
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup (Client)
Open a new terminal, navigate to the client folder, and install dependencies:
```bash
cd client
npm install
```

---

## 🏁 Running the Application

You need to run **both** the server and client simultaneously (in separate terminal windows).

### Terminal 1: Start Backend
```bash
cd server
npm run dev
```
*Output: "Server running on port 5000" & "MongoDB Connected"*

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```
*Output: "Local: http://localhost:5173"*

Open your browser and search for: **http://localhost:5173**

---

## 🔐 Default Credentials

The system auto-seeds these users if they don't exist:

### Administrator
-   **Email**: `admin@gmail.com`
-   **Password**: `admin@123`
-   **Dashboard**: Red Theme, Global Stats

### Police Officer
-   **Email**: `police@gmail.com`
-   **Password**: `police@123`
-   **Dashboard**: Blue Theme, Field Assignments

---

## 📂 Project Structure
```
Road Accident Witness Hub/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/         # Dashboard & Public Pages
│   │   ├── components/    # Reusable UI Components
│   │   └── App.jsx        # Routing & Theme Config
├── server/                 # Express Backend
│   ├── controllers/       # Logic for Auth & Reports
│   ├── models/            # Mongoose Schemas (User, Report)
│   ├── routes/            # API Endpoints
│   └── server.js          # Entry Point
└── README.md               # You are here
```
