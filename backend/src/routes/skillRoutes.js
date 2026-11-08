const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { validateBody, validateId } = require('../middleware/validate');
const schemas = require('../validators/schemas');

const {
    getAllSkills,
    createSkill,
    updateSkill,
    deleteSkill,
} = require('../controllers/skillController');

router.get('/', getAllSkills);
router.post('/', verifyToken, requireAdmin, validateBody(schemas.skill), createSkill);
router.put('/:id', verifyToken, requireAdmin, validateId, validateBody(schemas.skill), updateSkill);
router.delete('/:id', verifyToken, requireAdmin, validateId, deleteSkill);

module.exports = router;