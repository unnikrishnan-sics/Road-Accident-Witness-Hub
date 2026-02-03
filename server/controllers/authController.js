const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user (Citizen)
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            email,
            password,

            role: 'citizen', // Default to citizen
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            console.log(`[getMe] User: ${user.email}, isPatrol: ${user.isPatrol}`);
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                isPatrol: user.isPatrol
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update patrol status
// @route   PUT /api/auth/patrol
// @access  Private
exports.updatePatrolStatus = async (req, res) => {
    try {
        const { isPatrol } = req.body;
        console.log(`[updatePatrolStatus] Request Body:`, req.body);
        console.log(`[updatePatrolStatus] User ID: ${req.user.id}, New Status: ${isPatrol}`);

        const user = await User.findById(req.user.id);

        if (user) {
            user.isPatrol = isPatrol;
            const updatedUser = await user.save();
            console.log(`[updatePatrolStatus] Saved: ${updatedUser.isPatrol}`);

            res.json({
                success: true,
                isPatrol: updatedUser.isPatrol
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('[updatePatrolStatus] Error:', error);
        res.status(500).json({ message: error.message });
    }
};
