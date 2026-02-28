const Clothes = require('../models/clothesModel');
const cloudinary = require('../config/cloudinary');

exports.addClothes = async (req, res) => {
  try {
    console.log("Add Clothes Request Body:", req.body);
    console.log("Add Clothes Request Files:", req.files);

    const { name, category, subcategory, color, season, occasion } = req.body;

    if (!req.files || req.files.length === 0) {
      console.error("No files uploaded");
      return res.status(400).json({ message: "At least one image is required" });
    }

    const uploadedImages = [];

    for (let file of req.files) {
      console.log("Uploading to Cloudinary:", file.path);
      const result = await cloudinary.uploader.upload(file.path);
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id
      });
    }

    const clothes = new Clothes({
      name,
      category,
      subcategory,
      color,
      season: season ? season.split(",") : [],
      occasion: occasion ? occasion.split(",") : [],
      images: uploadedImages,
      status: "active"
    });

    await clothes.save();
    console.log("Clothes saved successfully:", clothes._id);
    res.status(201).json(clothes);

  } catch (error) {
    console.error("Error in addClothes:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllClothes = async (req, res) => {
  try {
    const clothes = await Clothes.find();
    res.status(200).json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClothes = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Clothes.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete images from Cloudinary
    for (let image of item.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    await Clothes.findByIdAndDelete(id);
    res.status(200).json({ message: "Item and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClothes = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Clothes.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
