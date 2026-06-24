const express = require('express');
const router = express.Router();

const {
    getSocialLinks
} = require('../controllers/socialLinkController');

router.get('/', getSocialLinks);

module.exports = router;