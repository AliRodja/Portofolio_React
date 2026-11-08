const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateBody, validateId } = require('../middleware/validate');
const schemas = require('../validators/schemas');

const {
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation,
} = require('../controllers/educationController');

router.get('/', getEducation);
router.post('/', verifyToken, requireAdmin, validateBody(schemas.education, schemas.educationRefine), createEducation);
router.put('/:id', verifyToken, requireAdmin, validateId, validateBody(schemas.education, schemas.educationRefine), updateEducation);
router.delete('/:id', verifyToken, requireAdmin, validateId, deleteEducation);

module.exports = router;