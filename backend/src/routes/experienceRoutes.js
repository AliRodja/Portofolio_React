const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const { validateBody, validateId } = require('../middleware/validate');
const schemas = require('../validators/schemas');

const {
    getAllExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} = require('../controllers/experienceController');

router.get('/', getAllExperiences);
router.post('/', verifyToken, validateBody(schemas.experience, schemas.experienceRefine), createExperience);
router.put('/:id', verifyToken, validateId, validateBody(schemas.experience, schemas.experienceRefine), updateExperience);
router.delete('/:id', verifyToken, validateId, deleteExperience);

module.exports = router;