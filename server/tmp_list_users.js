const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const users = await User.find({}, 'email name role');
        console.log('Users in DB:');
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
