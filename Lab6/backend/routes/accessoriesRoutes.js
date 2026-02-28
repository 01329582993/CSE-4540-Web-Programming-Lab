const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
    addAccessory,
} = require('../controllers/accessoriesController');

router.post('/', upload.single('image'), addAccessory);

module.exports = router;
