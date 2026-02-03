const express = require('express');
const router = express.Router();
const { registerUser, loginAdmin, getMe, updatePatrolStatus } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginAdmin);
router.get('/me', auth, getMe);
router.put('/patrol', auth, updatePatrolStatus);

module.exports = router;
