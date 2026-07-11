const express = require('express');
const router = express.Router();

const {
    getAllExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} = require('../controllers/experienceController');

router.get('/', getAllExperiences);
router.post('/', createExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

module.exports = router;