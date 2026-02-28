const express = require('express');
const router = express.Router();
const {
  addWeather,
  getAllWeather
} = require('../controllers/weatherController');

router.post('/', addWeather);
router.get('/', getAllWeather);

module.exports = router;
