const express = require('express');
const router = express.Router();
const {
    addLaundry,
    updateLaundry,
    getAllLaundry
} = require('../controllers/laundryController');

router.get('/', getAllLaundry);
router.post('/', addLaundry);
router.put('/:id', updateLaundry);

module.exports = router;
