const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
    createUser
} = require('../controllers/userController');

router.post('/', upload.single('profilePicture'), createUser);

module.exports = router;
