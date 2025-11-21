const express = require('express');
const { runCode, submitCode } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/run', protect, runCode);
router.post('/', protect, submitCode);

module.exports = router;
