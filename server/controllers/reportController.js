const Report = require('../models/Report');
const axios = require('axios');
const FormData = require('form-data');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const fs = require('fs');
const path = require('path');

// @desc    Create a new accident report
// @route   POST /api/reports
// @access  Public
exports.createReport = async (req, res) => {
    try {
        let { location, description, vehicleNo, severity, lat, lng } = req.body;
        let photoUrl = '';

        if (req.file) {
            // Ensure uploads directory exists
            const uploadDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generate unique filename
            const filename = `evidence-${Date.now()}${path.extname(req.file.originalname)}`;
            const filepath = path.join(uploadDir, filename);

            // Write buffer to file
            fs.writeFileSync(filepath, req.file.buffer);

            // Set URL (assuming server serves 'uploads' statically)
            // We'll construct the full URL if possible, or relative. 
            // Better to store relative: '/uploads/filename'
            photoUrl = `/uploads/${filename}`;
            console.log(`[Upload] Image saved to ${filepath}, URL: ${photoUrl}`);
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Authentication failed. Please login again.'
            });
        }

        // Duplicate Check (Within 500m and 1 hour)
        if (lat && lng) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const latRange = 0.0045; // ~500m
            const lngRange = 0.0045; // ~500m (approximate at equator, slightly more elsewhere but sufficient)

            const existingReport = await Report.findOne({
                'coordinates.lat': { $gte: lat - latRange, $lte: lat + latRange },
                'coordinates.lng': { $gte: lng - lngRange, $lte: lng + lngRange },
                timestamp: { $gte: oneHourAgo }
            });

            if (existingReport) {
                return res.status(409).json({
                    success: false,
                    error: 'A similar report has already been submitted for this location recently. Help is already on the way!'
                });
            }
        }

        const report = await Report.create({
            location,
            description,
            vehicleNo: vehicleNo || 'Unknown',
            severity,
            reporter: req.user.id,
            coordinates: (lat && lng) ? { lat, lng } : undefined,
            photos: photoUrl ? [photoUrl] : []
        });

        // Emit Real-Time Event
        if (req.io) {
            req.io.emit('new_report', report);
            console.log(`[Socket] Emitted new_report: ${report._id}`);
        }

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Create Report Error:', error);

        // Handle Mongoose Validation Errors specifically
        if (error.name === 'ValidationError') {
            const errors = {};
            Object.keys(error.errors).forEach(key => {
                errors[key] = error.errors[key].message;
            });
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }
};



// @desc    Analyze image for Number Plate (Gemini AI)
// @route   POST /api/reports/analyze
// @access  Public
exports.analyzeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use the model explicitly listed in the users account
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert buffer to base64
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype,
            },
        };

        const prompt = `Analyze this accident image and return a JSON object with the following fields:
        1. "vehicleNo": The license plate number (uppercase, no spaces). If not visible, use "".
        2. "severity": "Minor" (scratches/dents), "Major" (significant damage/airbags), or "Critical" (severe crush/rollover/fire).
        3. "description": A short 1-sentence description of the visual damage (e.g., "White SUV with front bumper crushed").
        Return ONLY valid JSON. Do not use markdown formatting.`;

        console.log("Sending image to Gemini for advanced analysis...");
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text().trim();

        // Cleanup markdown if present (Gemini sometimes adds ```json ... ```)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        console.log(`[Gemini] Raw Response: "${text}"`);

        try {
            const data = JSON.parse(text);
            return res.status(200).json({
                success: true,
                data: data
            });
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", text);
            // Fallback for simple text if it fails
            return res.status(200).json({
                success: false,
                error: 'AI analysis failed to produce valid data',
                raw: text
            });
        }

    } catch (error) {
        console.error("Gemini AI Analysis Error Full:", error);
        return res.status(200).json({
            success: false,
            error: 'AI service unavailable',
            text: ''
        });
    }
};


// @desc    Get reports submitted by the logged-in user
// @route   GET /api/reports/my-reports
// @access  Private
exports.getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ reporter: req.user.id }).sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update report status (Police/Admin)
// @route   PUT /api/reports/:id/status
// @access  Private
exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;

        let report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }

        // Update status
        report.status = status;
        await report.save();

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all reports (for Admin/Police)
// @route   GET /api/reports
// @access  Public (Protected in real app)
exports.getAllReports = async (req, res) => {
    try {
        const { vehicleNo } = req.query;
        let query = {};

        if (vehicleNo) {
            query.vehicleNo = { $regex: vehicleNo, $options: 'i' };
        }

        const reports = await Report.find(query).sort({ timestamp: -1 });

        // Identify duplicates/linked reports (Same location within 500m and 1 hour)
        const latRange = 0.0045;
        const lngRange = 0.0045;
        const timeLimit = 60 * 60 * 1000;

        const processedReports = reports.map(report => {
            const potentialDuplicates = reports.filter(other =>
                other._id.toString() !== report._id.toString() &&
                other.coordinates && report.coordinates &&
                Math.abs(other.coordinates.lat - report.coordinates.lat) <= latRange &&
                Math.abs(other.coordinates.lng - report.coordinates.lng) <= lngRange &&
                Math.abs(new Date(other.timestamp) - new Date(report.timestamp)) <= timeLimit
            );

            return {
                ...report.toObject(),
                duplicateCount: potentialDuplicates.length,
                isPrimary: potentialDuplicates.length === 0 ||
                    new Date(report.timestamp) <= Math.min(...potentialDuplicates.map(d => new Date(d.timestamp)))
            };
        });

        res.status(200).json({
            success: true,
            count: processedReports.length,
            data: processedReports
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
