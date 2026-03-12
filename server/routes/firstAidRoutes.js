const express = require('express');
const router = express.Router();
const { searchFirstAid } = require('../controllers/firstAidController');

router.get('/search', searchFirstAid);

module.exports = router;
