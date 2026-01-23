const express = require('express');
const router = express.Router();
const {
    addLaundry,
    updateLaundry
} = require('../controllers/laundryController');

router.post('/', addLaundry);
router.put('/:id', updateLaundry);

module.exports = router;
