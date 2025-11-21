const express = require('express');
const { getProblems, getProblemById, createProblem } = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProblems);
router.get('/:id', getProblemById);
router.post('/', protect, createProblem);

module.exports = router;
