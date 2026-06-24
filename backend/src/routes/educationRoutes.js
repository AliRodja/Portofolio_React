const express = require('express');
const router = express.Router();

const {
    getEducation
} = require('../controllers/educationController');

router.get('/', getEducation);

module.exports = router;