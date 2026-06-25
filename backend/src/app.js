const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const educationRoutes = require('./routes/educationRoutes');
const socialLinkRoutes = require('./routes/socialLinkRoutes');
const profileRoutes = require('./routes/profileRoutes');
const statsRoutes = require("./routes/statsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.get('/', (req, res) => {
    res.json({
        message: 'Portfolio API Running'
    });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            success: true,
            time: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/social-links', socialLinkRoutes);
module.exports = app;