const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const {
  addClothes,
  getAllClothes,
  deleteClothes,
  updateClothes
} = require('../controllers/clothesController');

// Add clothes (with images)
router.post('/', upload.array('images', 5), addClothes);

// Get all clothes
router.get('/', getAllClothes);

// Delete clothes
router.delete('/:id', deleteClothes);

// Update clothes
router.patch('/:id', updateClothes);

module.exports = router;
