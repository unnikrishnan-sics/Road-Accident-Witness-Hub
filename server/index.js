const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');


dotenv.config();
console.log("GEMINI_API_KEY Loaded:", process.env.GEMINI_API_KEY ? "YES (" + process.env.GEMINI_API_KEY.substring(0, 5) + "...)" : "NO");

const path = require('path');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST"]
    }
});

// Store active police locations: { socketId: { userId, lat, lng, timestamp } }
let activePatrols = {};

io.on('connection', (socket) => {
    console.log(`[Socket] New client connected: ${socket.id}`);

    // Police sending location updates
    socket.on('update_location', (data) => {
        // data expects: { userId, lat, lng }
        console.log(`[Socket] Received location from ${data.userId}: ${data.lat}, ${data.lng}`);
        activePatrols[socket.id] = {
            userId: data.userId,
            lat: data.lat,
            lng: data.lng,
            timestamp: Date.now()
        };
    });

    // Police stopping patrol
    socket.on('stop_patrol', () => {
        delete activePatrols[socket.id];
    });

    socket.on('disconnect', () => {
        console.log('[Socket] Client disconnected');
        delete activePatrols[socket.id];
    });
});

// Broadcast active patrols every 2 seconds
setInterval(() => {
    const patrols = Object.values(activePatrols);
    // Broadcast even if empty so clients clear inactive markers
    io.emit('patrol_update', patrols);
}, 2000);

// Make io accessible globally or pass it via middleware/export
// Ideally, we pass it via middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Middleware
app.use(express.json());
app.use(cors());

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Road Accident Witness Hub API is running...');
});

// Database Connection & Admin Seeding
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        // Seed Admin, and Police
        const seeds = [
            { email: 'admin@gmail.com', password: 'admin@123', role: 'admin' },
            { email: 'police@gmail.com', password: 'police@123', role: 'police' }
        ];

        try {
            for (const seed of seeds) {
                const user = await User.findOne({ email: seed.email });
                if (!user) {
                    await User.create(seed);
                    console.log(`Seeded: ${seed.email}`);
                } else {
                    // Update role if it doesn't match
                    if (user.role !== seed.role) {
                        user.role = seed.role;
                        await user.save();
                        console.log(`Updated role for: ${seed.email} to ${seed.role}`);
                    } else {
                        console.log(`Exists (Verified): ${seed.email}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error seeding users:', error);
        }

        server.listen(PORT, () => console.log(`Server running on port ${PORT} (Restarted)`));
    })
    .catch((err) => console.log(err));
