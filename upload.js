const express = require('express');
const path = require('path');
const multer = require('multer');
const processResume = require('./processResume');

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer Upload Settings (Accepts PDF & DOCX)
const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(null, true);
        } else {
            cb(new Error("Only .pdf and .docx files are allowed"));
        }
    }
});

// Render Upload Page
router.get("/", (req, res) => {
    res.render("mainpage");
});

// Handle File Upload and Processing
router.post("/matcher", upload.single("resume"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const jobDescription = req.body.job_description;
    const resumePath = req.file.path;

    try {
        const score = await processResume(jobDescription, resumePath);
        res.render("result", { jobDescription, score });
    } catch (error) {
        res.status(500).send("Error processing resume.");
    }
});

module.exports = router;
