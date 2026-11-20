const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateBody, validateId } = require('../middleware/validate');
const schemas = require('../validators/schemas');

const {
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
} = require('../controllers/socialLinkController');

router.get('/', getSocialLinks);
router.post('/', verifyToken, requireAdmin, validateBody(schemas.socialLink), createSocialLink);
router.put('/:id', verifyToken, requireAdmin, validateId, validateBody(schemas.socialLink), updateSocialLink);
router.delete('/:id', verifyToken, requireAdmin, validateId, deleteSocialLink);

module.exports = router;