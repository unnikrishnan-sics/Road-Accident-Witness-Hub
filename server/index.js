const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

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

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log(err));
