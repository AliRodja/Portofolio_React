const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const educationRoutes = require('./routes/educationRoutes');
const socialLinkRoutes = require('./routes/socialLinkRoutes');
const profileRoutes = require('./routes/profileRoutes');
const statsRoutes = require("./routes/statsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

// Default CORP (same-origin) blocks the frontend from loading /uploads
// images when it's served from a different origin in production.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Brute-force / spam protection on the endpoints attackers would target first.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' },
});

const messageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many messages sent. Please try again later.' },
});

app.use('/api/auth', authLimiter);
app.use('/api/messages', messageLimiter);

app.use('/api/uploads', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.get('/', (req, res) => {
    res.json({
        message: 'Portfolio API Running'
    });
});

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/social-links', socialLinkRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: 'Internal server error' });
});

module.exports = app;