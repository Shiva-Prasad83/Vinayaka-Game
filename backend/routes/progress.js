const express = require('express');
const router = express.Router();
const { getProgress, saveProgress, resetProgress } = require('../controllers/progressController');

router.get('/:playerId', getProgress);
router.post('/save', saveProgress);
router.post('/reset', resetProgress);

module.exports = router;
