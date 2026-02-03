const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { createReport, getAllReports, analyzeImage, getMyReports, updateReportStatus } = require('../controllers/reportController');

// Configure Multer (Memory Storage for forwarding to AI)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/analyze', upload.single('image'), analyzeImage); // Public for now, or protect if needed
router.post('/', auth, upload.single('image'), createReport);
router.get('/my-reports', auth, getMyReports);
router.get('/', getAllReports);
router.put('/:id/status', auth, updateReportStatus);

module.exports = router;
