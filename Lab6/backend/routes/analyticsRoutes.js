const express = require('express');
const router = express.Router();
const { wardrobeAnalytics } = require('../controllers/analyticsController');

router.get('/wardrobe', wardrobeAnalytics);

module.exports = router;
