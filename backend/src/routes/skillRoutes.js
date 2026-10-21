const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const { validateBody, validateId } = require('../middleware/validate');
const schemas = require('../validators/schemas');

const {
    getAllSkills,
    createSkill,
    updateSkill,
    deleteSkill,
} = require('../controllers/skillController');

router.get('/', getAllSkills);
router.post('/', verifyToken, validateBody(schemas.skill), createSkill);
router.put('/:id', verifyToken, validateId, validateBody(schemas.skill), updateSkill);
router.delete('/:id', verifyToken, validateId, deleteSkill);

module.exports = router;