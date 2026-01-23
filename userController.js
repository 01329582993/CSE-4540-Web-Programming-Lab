const User = require('../models/userModel');
const cloudinary = require('../config/cloudinary');

exports.createUser = async (req, res) => {
  try {
    const { name, location, stylePreferences } = req.body;

    // 1) Basic validation (name + location required by lab)
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "name and location are required",
      });
    }

    // 2) stylePreferences can come as:
    // - JSON string: '["minimalist","formal"]'
    // - single string: "minimalist"
    // - repeated form-data keys (multer may parse as array)
    let parsedStylePreferences = [];
    if (stylePreferences) {
      if (Array.isArray(stylePreferences)) {
        parsedStylePreferences = stylePreferences;
      } else {
        // try parse JSON array, else treat as single value
        try {
          const maybeArray = JSON.parse(stylePreferences);
          parsedStylePreferences = Array.isArray(maybeArray) ? maybeArray : [stylePreferences];
        } catch (e) {
          parsedStylePreferences = [stylePreferences];
        }
      }
    }

    // 3) Upload profile picture to Cloudinary if file exists
    let profilePicture = undefined;

    if (req.file) {
      // req.file.path should exist if multer is set to store a temp file.
      // If your multer uses memoryStorage, you'll need to adjust (ask me and I’ll fix it).
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "stylesync/users",
      });

      profilePicture = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }


    const user = await User.create({
      name,
      location,
      stylePreferences: parsedStylePreferences,
      ...(profilePicture && { profilePicture }),
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};