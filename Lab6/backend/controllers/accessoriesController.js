const Accessories = require('../models/accessoriesModel');
const cloudinary = require('../config/cloudinary');

exports.addAccessory = async (req, res) => {
  try {
    const { name, type, color, compatibleWith } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

   
    const result = await cloudinary.uploader.upload(req.file.path);

    const accessory = new Accessories({
      name,
      type,
      color,
      compatibleWith: compatibleWith ? compatibleWith.split(",") : [],
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });

    await accessory.save();
    res.status(201).json(accessory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
