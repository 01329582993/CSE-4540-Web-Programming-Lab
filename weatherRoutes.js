const express = require('express');
const router = express.Router();
const {
    addWeather
} = require('../controllers/weatherController');

router.post('/', addWeather);

module.exports = router;
