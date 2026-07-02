require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const resumeRoutes   = require('./routes/resume');
const careerRoutes   = require('./routes/careers');
const interviewRoutes = require('./routes/interview');
const atsRoutes      = require('./routes/ats');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/resume',    resumeRoutes);
app.use('/api/careers',   careerRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/ats',       atsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
